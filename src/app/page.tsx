import { redirect } from "next/navigation";
import { defaultLocale } from "@/lib/i18n/config";

/** proxy.ts normally redirects "/" first (using the saved or browser language); this is the fallback. */
export default function RootRedirect() {
  redirect(`/${defaultLocale}`);
}
