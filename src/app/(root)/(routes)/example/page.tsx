import { Button } from "@/components/Button";

export default function ExamplePage() {
  return (
    <main className="mx-auto flex max-w-[720px] flex-col gap-12 p-10">
      <header>
        <h1 className="typo-title-1">공용 컴포넌트 예시</h1>
        <p className="typo-body-2 mt-2 text-gray-500">
          pressed 상태는 직접 눌러서 확인하세요.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="typo-title-3">Button — Solid</h2>
        <div className="flex items-center gap-3">
          <Button>텍스트</Button>
          <Button disabled>텍스트</Button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="typo-title-3">Button — Outlined</h2>
        <div className="flex items-center gap-3">
          <Button variant="outlined">텍스트</Button>
          <Button variant="outlined" disabled>
            텍스트
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="typo-title-3">Button — Kakao</h2>
        <div className="flex items-center gap-3">
          <Button variant="kakao">카카오로 계속하기</Button>
        </div>
      </section>
    </main>
  );
}
