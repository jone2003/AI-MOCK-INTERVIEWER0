"use client";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import QuestionsSections from "./_components/QuestionsSections";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function StartInterview({ params }) {
    const resolvedParams = React.use(params);
    const [interviewData, setInterviewData] = useState();
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

    useEffect(() => {
        GetInterviewDetail();
    }, []);

    /**
     * Get Interview Details by MockId/Interview Id
     */
    const GetInterviewDetail = async () => {
        const result = await db
            .select()
            .from(MockInterview)
            .where(eq(MockInterview.mockId, resolvedParams.interviewId));
        console.log("DB Result:", result);
        console.log("jsonMockResp raw:", result[0]?.jsonMockResp);

        const jsonMockResp = JSON.parse(result[0]?.jsonMockResp);

        setMockInterviewQuestion(jsonMockResp);
        setInterviewData(result[0]);
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Questions */}
                <QuestionsSections
                    activeQuestionIndex={activeQuestionIndex}
                    mockInterViewQuestion={mockInterviewQuestion}
                />

                {/* Video/Audio Recording */}
                <RecordAnswerSection
                    activeQuestionIndex={activeQuestionIndex}
                    mockInterViewQuestion={mockInterviewQuestion}
                    interviewData={interviewData}
                />
            </div>

            <div className="flex justify-end gap-6 mt-6">
                {/* Previous Question */}
                {activeQuestionIndex > 0 && (
                    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>
                        Previous Question
                    </Button>
                )}

                {/* Next Question */}
                {activeQuestionIndex !== mockInterviewQuestion?.questions?.length - 1 && (
                    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>
                        Next Question
                    </Button>
                )}

                {/* End Interview */}
                {activeQuestionIndex === mockInterviewQuestion?.questions?.length - 1 && (
                    <Link href={`/Dashboard/interview/${interviewData?.mockId}/feedback`}>
                        <Button className="bg-green-600 text-white">End Interview</Button>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default StartInterview;
