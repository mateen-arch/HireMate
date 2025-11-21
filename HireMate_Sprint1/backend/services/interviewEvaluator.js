export const calculateFinalScore = ({
  cvScore = 0,
  interviewScore = 0,
  cvWeight = 0.4,
  interviewWeight = 0.6,
}) => {
  const normalizedCv = typeof cvScore === "number" ? cvScore : 0;
  const normalizedInterview =
    typeof interviewScore === "number" ? interviewScore : 0;

  const final =
    normalizedCv * cvWeight + normalizedInterview * interviewWeight;

  return Math.round(final * 100) / 100;
};

export const determinePostInterviewStatus = (finalScore) => {
  if (finalScore >= Number(process.env.FINAL_SCORE_THRESHOLD || 65)) {
    return {
      status: "READY_FOR_HUMAN_INTERVIEW",
      decision: "Auto-shortlisted for human interview",
    };
  }
  if (finalScore >= 50) {
    return {
      status: "PENDING_REVIEW",
      decision: "Borderline candidate – needs recruiter review",
    };
  }
  return {
    status: "REJECTED",
    decision: "Below threshold after AI interview",
  };
};



