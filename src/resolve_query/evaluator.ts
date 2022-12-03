import { OperationDefinition, OperationType } from "./ast.ts";
import { ZisakuQLResolvers, ZisakuQLReturn } from "./index.ts";

export class Evaluator {
	public constructor(
		private ast: OperationDefinition,
		private resolvers: ZisakuQLResolvers
	) {}

	public eval(): ZisakuQLReturn {
		let data: ZisakuQLReturn["data"] = null;
		const errors: ZisakuQLReturn["errors"] = [];

		const resolver = this.findResolver();

		if (resolver) {
			data = {
				[this.ast.name]: this.resolve(resolver),
			};
		} else {
			errors.push({ message: `query not found '${this.ast.name}'` });
		}

		return { data, errors };
	}

	// deno-lint-ignore no-explicit-any
	private findResolver(): ((...args: any[]) => any) | null {
		switch (this.ast.operationType) {
			case OperationType.Query: {
				if (!this.resolvers.Query) return null;
				return this.resolvers.Query[this.ast.name] ?? null;
			}
			default:
				return null;
		}
	}

	private resolve(
		// deno-lint-ignore no-explicit-any
		resolver: (...args: any[]) => any
	): Record<string, unknown> | null {
		const data = resolver(
			...(this.ast.variables ?? []).map((it) => it.value)
		);
		return this.selectFields(data, this.ast.selectionSet);
	}

	private selectFields(
		data: Record<string, unknown>,
		selectionSet: OperationDefinition["selectionSet"]
	): Record<string, unknown> {
		if (selectionSet.length === 0) return {};

		const result: Record<string, unknown> = {};

		selectionSet.forEach((it) => {
			const value = data[it.name];
			if (
				it.selectionSet?.length &&
				typeof value === "object" &&
				value !== null
			) {
				result[it.name] = this.selectFields(
					value as Record<string, unknown>,
					it.selectionSet
				);
			} else {
				result[it.name] = value;
			}
		});

		return result;
	}
}
