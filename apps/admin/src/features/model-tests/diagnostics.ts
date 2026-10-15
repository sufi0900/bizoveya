const explanations:Record<string,string>={
 response_matched:'The model returned the expected connectivity response. This does not qualify output quality.',
 unexpected_response:'The provider responded, but the expected connectivity text did not match.',
 preflight_failed:'No provider request was made: the final permission/configuration recheck failed. Refresh configuration and sign-in/MFA before a new authorized test. The unused reservation was released.',
 rate_limited:'The provider returned HTTP 429. Check the selected project/model limits; no automatic retry was made.',
 provider_payment_required:'The provider returned HTTP 402: payment or prepaid-credit requirements blocked the request.',
 provider_access_denied:'The provider returned HTTP 401/403: check the deployed credential and its permissions or restrictions.',
 provider_model_unavailable:'The provider returned HTTP 404: the model or API resource is unavailable to this request.',
 provider_request_rejected:'The provider returned HTTP 400: the request was rejected.',
 provider_schema_rejected:'The provider rejected the structured response configuration.',
 provider_precondition_failed:'The provider reported an unmet account, region or service prerequisite.',
 provider_key_invalid:'The provider reported an invalid or expired API key.',
 provider_key_blocked:'The provider reported a blocked API key.',
 provider_unavailable:'The provider returned HTTP 5xx: its service could not complete this request.',
 timeout:'Bizoveya stopped waiting after the bounded timeout. Provider execution and charges may still be unknown.',
 provider_error:'Historical or unclassified failure. This record cannot establish the HTTP status or whether the provider received the request.',
 interrupted:'The request lease expired without a confirmed result. Do not infer zero provider usage.'
};
export function testExplanation(code:string|null){return code&&explanations[code]||'No more specific diagnostic is available. Refresh records before another request.';}
