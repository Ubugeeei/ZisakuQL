import { Token, TokenType } from "./token.ts";

export class Lexer {
	private position: number;
	private readPosition: number;
	private ch: string;
	constructor(private input: string) {
		this.position = -1;
		this.readPosition = 0;
		this.ch = "\x1A";
	}

	public next(): Token {
		this.readChar();

		switch (this.ch) {
			case "(":
				return { type: TokenType.LeftParen, literal: this.ch };
			case ")":
				return { type: TokenType.RightParen, literal: this.ch };
			case "{":
				return { type: TokenType.LeftBrace, literal: this.ch };
			case "}":
				return { type: TokenType.RightBrace, literal: this.ch };
			case ":":
				return { type: TokenType.Colon, literal: this.ch };
			case "\x1A":
				return { type: TokenType.EOF, literal: this.ch };
			default:
				return { type: TokenType.Number, literal: "0" }; // 仮
		}
	}

	private readChar() {
		if (this.readPosition >= this.input.length) {
			this.ch = "\x1A";
		} else {
			this.position = this.readPosition;
			this.readPosition++;
			this.ch = this.input[this.position];
		}
	}
}

Deno.test("test Lexer (symbol)", async () => {
	const { assertEquals } = await import(
		"https://deno.land/std@0.167.0/testing/asserts.ts"
	);

	const lx = new Lexer("(){}:");

	assertEquals(lx.next(), {
		type: TokenType.LeftParen,
		literal: "(",
	});

	assertEquals(lx.next(), {
		type: TokenType.RightParen,
		literal: ")",
	});

	assertEquals(lx.next(), {
		type: TokenType.LeftBrace,
		literal: "{",
	});

	assertEquals(lx.next(), {
		type: TokenType.RightBrace,
		literal: "}",
	});

	assertEquals(lx.next(), {
		type: TokenType.Colon,
		literal: ":",
	});

	assertEquals(lx.next(), {
		type: TokenType.EOF,
		literal: "\x1A",
	});
	assertEquals(lx.next(), {
		type: TokenType.EOF,
		literal: "\x1A",
	});
});

Deno.test("test Lexer (tokenize words)", async () => {
	const { assertEquals } = await import(
		"https://deno.land/std@0.167.0/testing/asserts.ts"
	);

	const query = `
    query getTodo


    	name   id
  `;

	const lx = new Lexer(query);

	assertEquals(lx.next(), {
		type: TokenType.Query,
		literal: "query",
	});
	assertEquals(lx.next(), {
		type: TokenType.Identifier,
		literal: "getTodo",
	});
	assertEquals(lx.next(), {
		type: TokenType.Identifier,
		literal: "name",
	});
	assertEquals(lx.next(), {
		type: TokenType.Identifier,
		literal: "id",
	});
});

// Deno.test("test Lexer (tokenize query)", async () => {
// 	const { assertEquals } = await import(
// 		"https://deno.land/std@0.167.0/testing/asserts.ts"
// 	);

// 	const query = `
//     query getTodo(id: 1) {
//     	name
//     	description
//     	dueDate
//     	owner {
//     		id
//     		username
//     	}
//     }
//   `;

// 	const lx = new Lexer(query);

// 	assertEquals(lx.next(), {
// 		type: TokenType.Query,
// 		literal: "query",
// 	});
// 	assertEquals(lx.next(), {
// 		type: TokenType.Identifier,
// 		literal: "getTodo",
// 	});
// 	assertEquals(lx.next(), {
// 		type: TokenType.LeftParen,
// 		literal: "(",
// 	});
// 	assertEquals(lx.next(), {
// 		type: TokenType.Identifier,
// 		literal: "id",
// 	});
// 	assertEquals(lx.next(), {
// 		type: TokenType.Colon,
// 		literal: ":",
// 	});
// 	assertEquals(lx.next(), {
// 		type: TokenType.Number,
// 		literal: "1",
// 	});
// 	assertEquals(lx.next(), {
// 		type: TokenType.RightParen,
// 		literal: ")",
// 	});
// 	assertEquals(lx.next(), {
// 		type: TokenType.LeftBrace,
// 		literal: "{",
// 	});
// 	assertEquals(lx.next(), {
// 		type: TokenType.Identifier,
// 		literal: "name",
// 	});
// 	assertEquals(lx.next(), {
// 		type: TokenType.Identifier,
// 		literal: "description",
// 	});
// 	assertEquals(lx.next(), {
// 		type: TokenType.Identifier,
// 		literal: "dueDate",
// 	});
// 	assertEquals(lx.next(), {
// 		type: TokenType.Identifier,
// 		literal: "owner",
// 	});
// 	assertEquals(lx.next(), {
// 		type: TokenType.LeftBrace,
// 		literal: "{",
// 	});
// 	assertEquals(lx.next(), {
// 		type: TokenType.Identifier,
// 		literal: "id",
// 	});
// 	assertEquals(lx.next(), {
// 		type: TokenType.Identifier,
// 		literal: "username",
// 	});
// 	assertEquals(lx.next(), {
// 		type: TokenType.RightBrace,
// 		literal: "}",
// 	});
// 	assertEquals(lx.next(), {
// 		type: TokenType.RightBrace,
// 		literal: "}",
// 	});
// 	assertEquals(lx.next(), {
// 		type: TokenType.EOF,
// 		literal: "\x1A",
// 	});
// });
