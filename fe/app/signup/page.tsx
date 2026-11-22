import { redirect } from "next/navigation";

/** Signup is the same auth surface — keep /signup for old links. */
export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  qs.set("mode", "signup");
  const url = params.url;
  if (typeof url === "string" && url) qs.set("url", url);
  const plan = params.plan;
  if (typeof plan === "string" && plan) qs.set("plan", plan);
  redirect(`/login?${qs.toString()}`);
}
