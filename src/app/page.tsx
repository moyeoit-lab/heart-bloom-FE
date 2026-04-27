import Footer from "@/components/Footer";
import HomeActionSection from "@/components/(pages)/home/HomeActionSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-[var(--color-white)]">
      <section
        className="relative h-[910px] w-full max-w-[430px] overflow-hidden bg-[#bcd9ec]"
        aria-label="로그인 가입 화면"
      >
        <img
          src="/images/home.png"
          alt="마음 꽃집 메인 일러스트"
          className="h-[910px] w-full object-cover"
        />

        <div className="absolute left-0 top-[82px] flex w-full flex-col items-center gap-6 px-5 text-center">
          <p
            className="font-['KIMM'] text-[18px] font-light tracking-[-1px] text-[var(--color-red-400)]"
            style={{ lineHeight: "100%" }}
          >
            따뜻한 가정의 달에만 열리는
          </p>
          <h1
            className="font-['KIMM'] text-[52px] font-light tracking-[-2.257px] text-[var(--color-brown-400)]"
            style={{ lineHeight: "100%" }}
          >
            마음 꽃집
          </h1>
          <p className="typo-body-2 text-[var(--color-brown-200)]">
            평소 잊고 지낸 우리 가족의 속마음
            <br />꽃 문답을 주고받으며 마음을 더 깊게 이어보세요
          </p>
        </div>

        <HomeActionSection />
        <Footer />
      </section>
    </main>
  );
}
