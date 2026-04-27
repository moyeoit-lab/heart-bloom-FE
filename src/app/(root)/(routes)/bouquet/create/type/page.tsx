import BouquetTypeSelectPage from "@/components/pages/bouquet/create/BouquetTypeSelectPage";

type PageProps = {
  searchParams?: Promise<{
    nickname?: string | string[];
    recipient?: string | string[];
  }>;
};

const pickFirst = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value)?.trim() ?? "";

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const nickname = pickFirst(resolvedSearchParams?.nickname) || "이름";
  const recipient = pickFirst(resolvedSearchParams?.recipient);

  return <BouquetTypeSelectPage nickname={nickname} recipient={recipient} />;
}
