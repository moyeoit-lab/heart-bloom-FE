import RecipientSelectPage from "@/components/pages/bouquet/create/RecipientSelectPage";

type PageProps = {
  searchParams?: Promise<{
    nickname?: string | string[];
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const nicknameParam = resolvedSearchParams?.nickname;
  const nickname = (Array.isArray(nicknameParam) ? nicknameParam[0] : nicknameParam)?.trim() || "이름";

  return <RecipientSelectPage nickname={nickname} />;
}
