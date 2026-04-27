"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import chevronLeftIcon from "@/assets/icons/chevron-left-icon.svg";

const FAMILY_GROUPS = [
  { label: "부모님", chips: ["엄마", "아빠"] },
  { label: "자녀", chips: ["딸", "아들"] },
  { label: "형제자매", chips: ["누나", "언니", "형", "오빠", "동생"] },
];
const DEFAULT_NICKNAME = "이름";

export default function RecipientSelectPage() {
  const searchParams = useSearchParams();
  const nickname = searchParams.get("nickname")?.trim() || DEFAULT_NICKNAME;
  const router = useRouter();
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(
    null,
  );
  const [customRecipient, setCustomRecipient] = useState("");
  const trimmedCustomRecipient = customRecipient.trim();
  const isNextEnabled =
    Boolean(selectedRecipient) || trimmedCustomRecipient.length > 0;
  const recipient = selectedRecipient ?? trimmedCustomRecipient;

  const handleNext = () => {
    if (!isNextEnabled) return;
    router.push(
      `/bouquet/create/type?nickname=${encodeURIComponent(nickname)}&recipient=${encodeURIComponent(recipient)}`,
    );
  };

  const handleChipClick = (chip: string) => {
    setSelectedRecipient(chip);
    setCustomRecipient("");
  };

  const handleCustomRecipientChange = (value: string) => {
    setCustomRecipient(value);
    if (value.trim().length > 0) {
      setSelectedRecipient(null);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-[#fafafa]">
      <header className="flex items-center px-4 py-4">
        <Link
          href="/bouquet/create"
          aria-label="이전으로 돌아가기"
          className="flex h-6 w-6 items-center justify-center text-[var(--color-black)]"
        >
          <Image src={chevronLeftIcon} alt="" aria-hidden />
        </Link>
      </header>

      <section className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex flex-col px-5 pt-3">
            <div className="typo-title-3 flex flex-wrap items-end">
              <span className="text-[var(--color-red-300)]">{nickname}</span>
              <span className="text-[var(--color-brown-300)]">님은 </span>
            </div>
            <h1 className="typo-title-3 text-[var(--color-brown-300)] mb-4">
              누구에게 마음을 전달하고 싶나요?
            </h1>
            <p className="typo-body-2 text-[var(--color-brown-200)] mb-5">
              꽃다발은 1개당 1명에게만 보낼 수 있어요.
            </p>
          </div>

          <div className="mt-1 flex flex-col">
            {FAMILY_GROUPS.map((group) => (
              <div key={group.label} className="flex flex-col gap-2 px-5 py-3">
                <p className="typo-body-2-1 text-[var(--color-gray-600)]">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-3">
                  {group.chips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleChipClick(chip)}
                      className={`typo-body-1 h-11 min-w-20 rounded-[10px] px-3 ${
                        selectedRecipient === chip
                          ? "border border-[var(--color-green-300)] bg-[var(--color-green-100)] text-[var(--color-green-400)]"
                          : "border border-[var(--color-gray-100)] bg-[var(--color-white)] text-[var(--color-gray-300)]"
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex flex-col gap-2 px-5 py-3">
              <p className="typo-body-2-1 text-[var(--color-gray-600)]">
                그 밖의 가족
              </p>
              <input
                type="text"
                maxLength={10}
                value={customRecipient}
                onChange={(event) =>
                  handleCustomRecipientChange(event.target.value)
                }
                placeholder="ex. 고모, 이모, 삼촌, 할아버지, 할머니 등"
                className={`typo-body-1 h-12 w-full rounded-xl border px-3 focus:outline-none ${
                  trimmedCustomRecipient.length > 0
                    ? "border-[var(--color-green-300)] text-[var(--color-brown-600)] placeholder:text-[var(--color-brown-600)]"
                    : "border-[var(--color-gray-100)] text-[var(--color-gray-900)] placeholder:text-[var(--color-gray-200)]"
                }`}
              />
              <p className="typo-caption-2 text-[var(--color-gray-400)]">
                10자 이내
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-transparent to-white px-5 pb-5 pt-8">
          <button
            type="button"
            disabled={!isNextEnabled}
            onClick={handleNext}
            className={`typo-body-1 h-12 w-full rounded-xl ${
              isNextEnabled
                ? "bg-[var(--color-green-400)] text-[var(--color-white)]"
                : "bg-[rgba(112,115,124,0.08)] text-[var(--color-gray-700)]"
            }`}
          >
            다음으로
          </button>
        </div>
      </section>
    </main>
  );
}
