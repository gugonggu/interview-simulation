export const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export function formatToKorean12Hour(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();

  const period = hours < 12 ? "오전" : "오후";

  // 12시간제 변환
  hours = hours % 12;
  if (hours === 0) hours = 12;

  const minutesStr = String(minutes).padStart(2, "0");

  return `${period} ${String(hours).padStart(2, "0")}:${minutesStr}`;
}

export function getGradeFromScore(scoreStr: string): string {
  const score = parseInt(scoreStr.replace(/[^0-9]/g, ""), 10);

  if (score >= 90) return "A+";
  if (score >= 85) return "A";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "C+";
  if (score >= 65) return "C";
  if (score >= 60) return "D";
  return "F";
}
