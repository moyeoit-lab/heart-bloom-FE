import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "꽃다발 완성 | 마음 꽃집",
  description: "1차 포장 / 링크 공유 페이지 (미구현)",
};

export default function Page() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[375px] flex-col items-center justify-center gap-4 bg-[#fafafa] p-5 text-center">
      <h1 className="typo-title-2 text-[var(--color-brown-300)]">
        꽃다발 만들기 흐름 끝!
      </h1>
      <p className="typo-body-2 text-[var(--color-brown-200)]">
        여기는 1차 포장 / 링크 공유 페이지가 들어갈 자리예요.
      </p>
      <p className="typo-caption-1 text-[var(--color-gray-300)]">
        BE 라우트(`/api/v1/bouquets/sender`) 슬래시 수정 후 실제 POST 연동 예정
      </p>
    </main>
  );
}
