import Link from "next/link";
import { businessPresets,sampleForPreset,type BusinessDocument } from "@/domain/business";
import { MarketingShell } from "@/features/marketing/shell";
import { BusinessWorkbench } from "./workbench";
export function BusinessTemplatePage({id}:{id:BusinessDocument["templateId"]}) {
 const preset=businessPresets.find(p=>p.id===id)!;
 return <MarketingShell><section className="biz-page-intro compact"><p className="biz-eyebrow">BUSINESS / {preset.name}</p><h1>Your next chapter.<br/><em>Your own style.</em></h1><p>{preset.description} Try the fictional sample; content stays when you switch designs.</p><p>These designs do not include booking, checkout, student portals or automated integrations. Contact actions use your email or phone.</p><Link className="biz-btn" href={`/get-started?journey=new&template=${id}`}>Create your business draft</Link></section><section className="biz-demo"><BusinessWorkbench initialDocument={sampleForPreset(id)} demo /></section></MarketingShell>;
}
