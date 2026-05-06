import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { status: 200, headers: corsHeaders });

  try {
    const { submission_id, answers } = await req.json();
    // answers: { question_id: string, answer: string }[]

    if (!submission_id || !answers) {
      return new Response(JSON.stringify({ error: "Missing submission_id or answers" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Fetch submission to verify it exists and isn't already submitted
    const { data: submission, error: subErr } = await supabase
      .from("sod_submissions")
      .select("id, exam_id, user_id, submitted_at")
      .eq("id", submission_id)
      .single();

    if (subErr || !submission) {
      return new Response(JSON.stringify({ error: "Submission not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (submission.submitted_at) {
      return new Response(JSON.stringify({ error: "Exam already submitted" }), {
        status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch all questions for this exam (with correct_answer — service role bypasses RLS)
    const { data: questions, error: qErr } = await supabase
      .from("sod_questions")
      .select("id, type, correct_answer, marks")
      .eq("exam_id", submission.exam_id);

    if (qErr || !questions) {
      return new Response(JSON.stringify({ error: "Failed to fetch questions" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const totalMarks = questions.reduce((sum: number, q: any) => sum + q.marks, 0);
    let autoScore = 0;

    // Build answer rows and auto-grade MCQ
    const answerRows = answers.map((a: { question_id: string; answer: string }) => {
      const question = questions.find((q: any) => q.id === a.question_id);
      let marks_awarded: number | null = null;

      if (question?.type === "mcq") {
        marks_awarded = a.answer?.trim().toLowerCase() === question.correct_answer?.trim().toLowerCase()
          ? question.marks : 0;
        autoScore += marks_awarded;
      }

      return {
        submission_id,
        question_id: a.question_id,
        answer: a.answer ?? "",
        marks_awarded,
      };
    });

    // Upsert answers
    const { error: ansErr } = await supabase.from("sod_answers").upsert(answerRows, {
      onConflict: "submission_id,question_id",
    });

    if (ansErr) {
      return new Response(JSON.stringify({ error: ansErr.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if all questions are MCQ (fully auto-gradeable)
    const hasManual = questions.some((q: any) => q.type === "short" || q.type === "long");

    // Update submission
    const { error: updateErr } = await supabase
      .from("sod_submissions")
      .update({
        submitted_at: new Date().toISOString(),
        score: hasManual ? autoScore : autoScore,
        total_marks: totalMarks,
        graded: !hasManual,
      })
      .eq("id", submission_id);

    if (updateErr) {
      return new Response(JSON.stringify({ error: updateErr.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error", details: String(err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
