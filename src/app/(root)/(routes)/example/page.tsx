import { Button } from "@/components/Button";
import { Switch } from "@/components/Switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";

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

      <section className="flex flex-col gap-4">
        <h2 className="typo-title-3">Switch</h2>
        <div className="flex items-center gap-3">
          <Switch />
          <Switch defaultChecked />
          <Switch disabled />
          <Switch defaultChecked disabled />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="typo-title-3">Tabs</h2>
        <Tabs defaultValue="left" className="w-[224.667px]">
          <TabsList>
            <TabsTrigger value="left">텍스트</TabsTrigger>
            <TabsTrigger value="right">텍스트</TabsTrigger>
          </TabsList>
          <TabsContent value="left" className="typo-body-2 text-gray-600">
            첫 번째 탭 내용
          </TabsContent>
          <TabsContent value="right" className="typo-body-2 text-gray-600">
            두 번째 탭 내용
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
