import { createClient } from "@connectrpc/connect";
import { ElizaService } from "@buf/connectrpc_eliza.bufbuild_es/connectrpc/eliza/v1/eliza_pb";
import { transport } from "./transport";

export const elizaClient = createClient(ElizaService, transport);
