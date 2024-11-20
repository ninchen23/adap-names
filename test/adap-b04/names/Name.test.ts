import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b04/names/Name";
import { StringName } from "../../../src/adap-b04/names/StringName";
import { StringArrayName } from "../../../src/adap-b04/names/StringArrayName";
import { IllegalArgumentException } from "../../../src/adap-b04/common/IllegalArgumentException";

describe("AbstractName Tests", () => {
  it("test constructor", () => {
    let n: Name = new StringName("oss.fau.de");
    let n2: Name = new StringArrayName(["oss", "fau", "de"]);
    expect(n.getDelimiterCharacter()).toBe(".");
    expect(n2.getDelimiterCharacter()).toBe(".");
  });
  it("test clone", () => {
    let n: StringName = new StringName("oss.fau.de");
    let n2: StringArrayName = new StringArrayName(["oss", "fau", "de"]);
    expect(n.clone().asString()).toBe("oss.fau.de");
    expect(n2.clone().asString()).toBe("oss.fau.de");
  });
  it("test isEqual", () => {
    let n: StringName = new StringName("oss.fau.de");
    let n2: StringArrayName = new StringArrayName(["oss", "fau", "de"]);
    expect(n.isEqual(n2)).toBe(true);
    expect(n2.isEqual(n)).toBe(true);

    expect(n.getHashCode()).toBe(n2.getHashCode());

    n.append("blub");

    expect(n.isEqual(n2)).toBe(false);
    expect(n2.isEqual(n)).toBe(false);
    expect(n.getHashCode()).not.toBe(n2.getHashCode());
  })
  it("test concat", () => {
    // TODO
  })
});
describe("StringName Tests", () => {
  it("test constructor", () => {
    expect(() => new StringName(undefined as any)).toThrow(IllegalArgumentException);
    expect(() => new StringArrayName(undefined as any)).toThrow(IllegalArgumentException);

    expect(() => new StringName(null as any)).toThrow(IllegalArgumentException);
    expect(() => new StringArrayName(null as any)).toThrow(IllegalArgumentException);
  });
  it("test getComponent", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    expect(n.getComponent(1)).toBe("fau");

    let n2: Name = new StringName("oss.fau.de");
    expect(n2.getComponent(1)).toBe("fau");

    expect(() => n.getComponent(5)).toThrow(IllegalArgumentException);
    expect(() => n2.getComponent(5)).toThrow(IllegalArgumentException);

    expect(() => n.getComponent(undefined as any)).toThrow(IllegalArgumentException);
    expect(() => n2.getComponent(undefined as any)).toThrow(IllegalArgumentException);

    expect(() => n.getComponent(null as any)).toThrow(IllegalArgumentException);
    expect(() => n2.getComponent(null as any)).toThrow(IllegalArgumentException);
  });
  it("test setComponent", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.setComponent(1, "cs");
    expect(n.asString()).toBe("oss.cs.de");

    let n2: Name = new StringName("oss.fau.de");
    n2.setComponent(1, "cs");
    expect(n2.asString()).toBe("oss.cs.de");

    expect(() => n.setComponent(5, "blub")).toThrow(IllegalArgumentException);
    expect(() => n2.setComponent(5, "blub")).toThrow(IllegalArgumentException);

    expect(() => n.setComponent(undefined as any, "blub")).toThrow(IllegalArgumentException);
    expect(() => n2.setComponent(undefined as any, "blub")).toThrow(IllegalArgumentException);

    expect(() => n.setComponent(null as any, "blub")).toThrow(IllegalArgumentException);
    expect(() => n2.setComponent(null as any, "blub")).toThrow(IllegalArgumentException);

    expect(() => n.setComponent(5, undefined as any)).toThrow(IllegalArgumentException);
    expect(() => n2.setComponent(5, undefined as any)).toThrow(IllegalArgumentException);

    expect(() => n.setComponent(5, null as any)).toThrow(IllegalArgumentException);
    expect(() => n2.setComponent(5, null as any)).toThrow(IllegalArgumentException);
  });
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");

    let n2: Name = new StringName("oss.fau.de");
    n2.insert(1, "cs");
    expect(n2.asString()).toBe("oss.cs.fau.de");

    expect(() => n.insert(5, "blub")).toThrow(IllegalArgumentException);
    expect(() => n2.insert(5, "blub")).toThrow(IllegalArgumentException);

    expect(() => n.insert(undefined as any, "blub")).toThrow(IllegalArgumentException);
    expect(() => n2.insert(undefined as any, "blub")).toThrow(IllegalArgumentException);

    expect(() => n.insert(null as any, "blub")).toThrow(IllegalArgumentException);
    expect(() => n2.insert(null as any, "blub")).toThrow(IllegalArgumentException);

    expect(() => n.insert(5, undefined as any)).toThrow(IllegalArgumentException);
    expect(() => n2.insert(5, undefined as any)).toThrow(IllegalArgumentException);

    expect(() => n.insert(5, null as any)).toThrow(IllegalArgumentException);
    expect(() => n2.insert(5, null as any)).toThrow(IllegalArgumentException);
  });
  it("append", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");

    let n2: Name = new StringName("oss.cs.fau");
    n2.append("de");
    expect(n2.asString()).toBe("oss.cs.fau.de");

    expect(() => n.append(undefined as any)).toThrow(IllegalArgumentException);
    expect(() => n2.append(undefined as any)).toThrow(IllegalArgumentException);

    expect(() => n.append(null as any)).toThrow(IllegalArgumentException);
    expect(() => n2.append(null as any)).toThrow(IllegalArgumentException);
  });
  it("test remove", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");

    let n2: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n2.remove(0);
    expect(n.asString()).toBe("cs.fau.de");

    expect(() => n.remove(5)).toThrow(IllegalArgumentException);
    expect(() => n2.remove(5)).toThrow(IllegalArgumentException);

    expect(() => n.remove(undefined as any)).toThrow(IllegalArgumentException);
    expect(() => n2.remove(undefined as any)).toThrow(IllegalArgumentException);

    expect(() => n.remove(null as any)).toThrow(IllegalArgumentException);
    expect(() => n2.remove(null as any)).toThrow(IllegalArgumentException);
  });
  // it("test concat", () => {
    
  // });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    let n: Name = new StringName("oss.cs.fau.de", '#');
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
});

describe("clone", () => {
  it("test clone", () => {
    let n: StringName = new StringName("oss.cs.fau.de");
    n.append("nina");

    const objClass = n.constructor;
    // console.log(objClass.name);

    const clone = n.clone();
    const objClass2 = clone.constructor;
    // console.log(objClass2.name);

    expect(n.clone().asString()).toBe("oss.cs.fau.de.nina");

    n.append("nina");

    expect(clone.asString()).toBe("oss.cs.fau.de.nina");
    expect(n.asString()).toBe("oss.cs.fau.de.nina.nina");
  });
})

describe("string", () => {
  it("test asString and asDataString", () => {
    let n: StringName = new StringName("oss.cs\\.fau.de");
    let n2: StringArrayName = new StringArrayName(["oss", "cs\\.fau", "de"]);

    expect(n.asString("-")).toBe("oss-cs.fau-de");
    expect(n2.asString("-")).toBe("oss-cs.fau-de");

    // console.log(n.asDataString());
    // console.log(n2.asDataString());
    expect(n.asDataString()).toBe("{\"dataString\":\"oss.cs\\\\.fau.de\",\"delimiter\":\".\"}");
    expect(n2.asDataString()).toBe("{\"dataString\":\"oss.cs\\\\.fau.de\",\"delimiter\":\".\"}");

    let n3: StringArrayName = new StringArrayName(["fau"]);
    expect(n3.asDataString()).toBe("{\"dataString\":\"fau\",\"delimiter\":\".\"}");
  })
})

describe("length", () => {
  it("test length", () => {
    let n: StringName = new StringName("oss.cs.fau.de");
    let n2: StringArrayName = new StringArrayName(["oss", "cs", "fau", "de"]);

    // expect(n.getLength()).toBe(4);
    expect(n.getNoComponents()).toBe(4);
    expect(n2.getNoComponents()).toBe(4);

    n.append("blub");

    expect(n.getNoComponents()).toBe(5);
    expect(n2.getNoComponents()).toBe(4);
  })
})
