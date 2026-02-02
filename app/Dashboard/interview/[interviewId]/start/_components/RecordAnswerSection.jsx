"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModel";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

function RecordAnswerSection({
    activeQuestionIndex,
    mockInterViewQuestion,
    interviewData,
}) {
    const [userAnswer, setUserAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useUser();

    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false,
    });

    if (error) {
        toast(error);
        return;
    }

    useEffect(() => {
        results.map((result) => {
            setUserAnswer((prevAns) => prevAns + result?.transcript);
        });
    }, [results]);

    // Clear answer when moving to a new question
    useEffect(() => {
        setUserAnswer("");
        setResults([]);
    }, [activeQuestionIndex]);

    const StartStopRecording = async () => {
        if (isRecording) {
            stopSpeechToText();
        } else {
            startSpeechToText();
        }
    };

    const UpdateUserAnswerInDb = async () => {
        if (userAnswer.length < 10) {
            toast.error("Answer is too short. Please provide a more detailed answer.");
            return;
        }

        try {
            console.log("Saving user answer:", userAnswer);
            setLoading(true);

            const feedbackPromt = `Question: ${mockInterViewQuestion?.questions[activeQuestionIndex]?.question
                }, User Answer: ${userAnswer}. Based on the question and the user's answer, please provide a rating 1 to 10 for the answer and feedback in the form of areas for improvement, if any. The feedback should be JSON only with fields "rating" and "feedback". Keep feedback 3 to 5 lines.`;

            const result = await chatSession.sendMessage(feedbackPromt);
            const mockJsonResp = result.response
                .text()
                .replace("```json", "")
                .replace("```", "");

            const JsonFeedbackResp = JSON.parse(mockJsonResp);

            const resp = await db.insert(UserAnswer).values({
                mockIdRef: interviewData?.mockId,
                question:
                    mockInterViewQuestion?.questions[activeQuestionIndex]?.question,
                correctAns:
                    mockInterViewQuestion?.questions[activeQuestionIndex]?.answer,
                userAns: userAnswer,
                feedback: JsonFeedbackResp?.feedback,
                rating: JsonFeedbackResp?.rating,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format("DD-MM-yyyy"),
            });

            if (resp) {
                toast.success("User Answer recorded successfully!");
                setUserAnswer("");
                setResults([]);
            }
        } catch (err) {
            console.error("Error saving answer:", err);
            toast.error("Failed to save your answer. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center flex-col">
            <div className="flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5">
                <Image src={"/webcam.png"} width={200} height={200} className="absolute" />
                <Webcam
                    mirrored={true}
                    style={{
                        height: "50vh",
                        width: "100%",
                        zIndex: 10,
                    }}
                />
            </div>

            <Button
                disabled={loading}
                variant="outline"
                onClick={StartStopRecording}
                className="my-10"
            >
                {isRecording ? (
                    <h2 className="flex items-center justify-center text-red-600 gap-2">
                        <StopCircle />
                        Stop Recording
                    </h2>
                ) : (
                    <h2 className="flex items-center justify-center gap-2">
                        <Mic />
                        Record Answer
                    </h2>
                )}
            </Button>

            {/* Display current answer */}
            {userAnswer && (
                <div className="w-full mt-4 p-4 border rounded-lg bg-secondary">
                    <h3 className="font-semibold mb-2">Your Answer:</h3>
                    <p className="text-sm">{userAnswer}</p>
                </div>
            )}

            {/* Save Answer Button */}
            {userAnswer && !isRecording && (
                <Button
                    disabled={loading}
                    onClick={UpdateUserAnswerInDb}
                    className="mt-4 bg-primary text-white"
                >
                    {loading ? "Saving..." : "Save Answer"}
                </Button>
            )}
        </div>
    );
}

export default RecordAnswerSection;
