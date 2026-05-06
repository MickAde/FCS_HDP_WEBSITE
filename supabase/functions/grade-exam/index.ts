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

    console.log('Grade exam request:', { submission_id, answersCount: answers?.length });

    if (!submission_id || !answers) {
      console.error('Missing required fields:', { submission_id: !!submission_id, answers: !!answers });
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Missing submission_id or answers" 
      }), {
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
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

    if (subErr) {
      console.error('Submission fetch error:', subErr);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Submission not found: " + subErr.message 
      }), {
        status: 404, 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!submission) {
      console.error('No submission found for ID:', submission_id);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Submission not found" 
      }), {
        status: 404, 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (submission.submitted_at) {
      console.warn('Exam already submitted:', submission_id);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Exam already submitted" 
      }), {
        status: 409, 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch all questions for this exam (with correct_answer — service role bypasses RLS)
    const { data: questions, error: qErr } = await supabase
      .from("sod_questions")
      .select("id, type, correct_answer, marks")
      .eq("exam_id", submission.exam_id);

    if (qErr) {
      console.error('Questions fetch error:', qErr);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Failed to fetch questions: " + qErr.message 
      }), {
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!questions || questions.length === 0) {
      console.error('No questions found for exam:', submission.exam_id);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "No questions found for this exam" 
      }), {
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log('Found questions:', questions.length);

    const totalMarks = questions.reduce((sum: number, q: any) => sum + (q.marks || 0), 0);
    let autoScore = 0;

    // Build answer rows and auto-grade MCQ
    const answerRows = answers.map((a: { question_id: string; answer: string }) => {
      const question = questions.find((q: any) => q.id === a.question_id);
      let marks_awarded: number | null = null;

      if (question?.type === "mcq" && question.correct_answer) {
        const studentAnswer = (a.answer || '').trim().toLowerCase();
        const correctAnswer = question.correct_answer.trim().toLowerCase();
        marks_awarded = studentAnswer === correctAnswer ? (question.marks || 0) : 0;
        autoScore += marks_awarded;
        console.log('MCQ graded:', { 
          questionId: a.question_id, 
          studentAnswer, 
          correctAnswer, 
          marks: marks_awarded 
        });
      }

      return {
        submission_id,
        question_id: a.question_id,
        answer: a.answer || "",
        marks_awarded,
      };
    });

    console.log('Answer rows prepared:', answerRows.length, 'Auto score:', autoScore);

    // Upsert answers
    const { error: ansErr } = await supabase.from("sod_answers").upsert(answerRows, {
      onConflict: "submission_id,question_id",
    });

    if (ansErr) {
      console.error('Answer upsert error:', ansErr);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Failed to save answers: " + ansErr.message 
      }), {
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log('Answers saved successfully');

    // Check if all questions are MCQ (fully auto-gradeable)
    const hasManual = questions.some((q: any) => q.type === "short" || q.type === "long");
    const isFullyGraded = !hasManual;

    console.log('Grading status:', { hasManual, isFullyGraded, autoScore, totalMarks });

    // Update submission
    const { error: updateErr } = await supabase
      .from("sod_submissions")
      .update({
        submitted_at: new Date().toISOString(),
        score: autoScore, // Always set the auto score
        total_marks: totalMarks,
        graded: isFullyGraded, // Only mark as graded if no manual questions
      })
      .eq("id", submission_id);

    if (updateErr) {
      console.error('Submission update error:', updateErr);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Failed to update submission: " + updateErr.message 
      }), {
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log('Submission updated successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      score: autoScore, 
      totalMarks, 
      fullyGraded: isFullyGraded 
    }), {
      status: 200, 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(JSON.stringify({ 
      success: false, 
      error: "Internal server error", 
      details: String(err) 
    }), {
      status: 500, 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
