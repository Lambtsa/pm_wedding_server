import { CustomZodError } from "@core/errors";
import { validateData, sanitiseData } from "./sanitise";
import { TypeOf, z, ZodError, ZodType, ZodTypeDef } from "zod";

describe("Sanity test", () => {
  test("1 should equal 1", () => {
    expect(1).toBe(1);
  });
});

describe("validateData helper for object", () => {
  const testSchema: z.ZodType<{ artist: string; title: string }> = z.object({
    artist: z.string().min(1),
    title: z.string().min(1),
  });

  type Schema = TypeOf<typeof testSchema>;
  test("Empty string for both artist and title should throw an error", () => {
    const input: Schema = { artist: "", title: "" };
    const isValid = testSchema.safeParse(input);
    if (!isValid.success) {
      expect(() => {
        validateData({ artist: "", title: "" }, testSchema);
      }).toThrowError(
        new CustomZodError(
          isValid.error as ZodError<ZodType<Schema, ZodTypeDef, Schema>>,
        ),
      );
    }
  });
  test("Empty string for artist should throw an error", () => {
    const input: Schema = { artist: "", title: "Fragile" };
    const isValid = testSchema.safeParse(input);
    if (!isValid.success) {
      expect(() => {
        validateData({ artist: "", title: "Fragile" }, testSchema);
      }).toThrowError(
        new CustomZodError(
          isValid.error as ZodError<ZodType<Schema, ZodTypeDef, Schema>>,
        ),
      );
    }
  });
  test("Empty string for title should throw an error", () => {
    const input: Schema = { artist: "Last Train", title: "" };
    const isValid = testSchema.safeParse(input);

    if (!isValid.success) {
      expect(() => {
        validateData({ artist: "Last Train", title: "" }, testSchema);
      }).toThrowError(
        new CustomZodError(
          isValid.error as ZodError<ZodType<Schema, ZodTypeDef, Schema>>,
        ),
      );
    }
  });

  test("Empty string for title should throw a bad Request error", () => {
    const input: Schema = { artist: "Last Train", title: "" };
    const isValid = testSchema.safeParse(input);

    if (!isValid.success) {
      expect(() => {
        validateData({ artist: "Last Train", title: "" }, testSchema);
      }).toThrowError(
        new CustomZodError(
          isValid.error as ZodError<ZodType<Schema, ZodTypeDef, Schema>>,
        ),
      );
    }
  });
});

describe("sanitiseData helper function", () => {
  test("should remove unnecessary spaces", () => {
    expect(sanitiseData("Last    Train    ")).toBe("Last Train");
  });
  test("should otherwise keep same string", () => {
    expect(sanitiseData("LaSt Train")).toBe("LaSt Train");
  });

  test("Input that has whitespace should be returned without", () => {
    expect(sanitiseData("   Last Train")).toBe("Last Train");
  });
});
