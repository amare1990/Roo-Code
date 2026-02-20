import type { PreHook } from "../types"
import { readActiveIntents } from "../utils/fileUtils"

export const intentValidator: PreHook = async (ctx) => {
	if (!ctx.intentId) throw new Error("You must cite a valid active Intent ID.")

	const intents = await readActiveIntents()
	const found = intents.find((i) => i.id === ctx.intentId)
	if (!found) throw new Error(`You must cite a valid active Intent ID. Intent ${ctx.intentId} not found.`)
	const toolName = ctx.metadata && (ctx.metadata as any).tool
	const params = ctx.metadata && (ctx.metadata as any).params

	const MUTATING_TOOLS = new Set([
		"write_to_file",
		"apply_diff",
		"edit",
		"search_and_replace",
		"edit_file",
		"apply_patch",
		"execute_command",
		"use_mcp_tool",
		"access_mcp_resource",
		"new_task",
		"attempt_completion",
		"run_slash_command",
		"skill",
		"generate_image",
	])

	const isMcp = typeof toolName === "string" && toolName.startsWith("mcp:")
	const isMutating = typeof toolName === "string" && (MUTATING_TOOLS.has(toolName) || isMcp)

	if (isMutating) {
		const mutation = params?.mutation_class ?? params?.mutationClass
		if (!mutation) {
			throw new Error(`Mutating tool '${toolName}' requires params.mutation_class (mutation_class) to be set.`)
		}
	}
}
