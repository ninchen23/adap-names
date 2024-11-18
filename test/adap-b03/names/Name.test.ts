import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b03/names/Name";
import { StringName } from "../../../src/adap-b03/names/StringName";
import { StringArrayName } from "../../../src/adap-b03/names/StringArrayName";

describe("Basic StringName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss.fau.de");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringName("oss.cs.fau");
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Basic StringArrayName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss#fau#de", '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
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

    console.log(n.asDataString());
    console.log(n2.asDataString());
    expect(n.asDataString()).toBe("{\"dataString\":\"oss.cs\\\\.fau.de\",\"delimiter\":\".\"}");
    expect(n2.asDataString()).toBe("{\"dataString\":\"oss.cs\\\\.fau.de\",\"delimiter\":\".\"}");

    let n3: StringArrayName = new StringArrayName(["fau"]);
    expect(n3.asDataString()).toBe("{\"dataString\":\"fau\",\"delimiter\":\".\"}");
  })
})

describe("equality", () => {
  it("test equals", () => {
    let n: StringName = new StringName("oss.cs.fau.de");
    let n2: StringArrayName = new StringArrayName(["oss", "cs", "fau", "de"]);

    // console.log(n.asDataString());
    // console.log(n2.asDataString());
    // console.log(n.getHashCode());
    // console.log(n2.getHashCode());

    expect(n.isEqual(n2)).toBe(true);
    expect(n2.isEqual(n)).toBe(true);
    expect(n.getHashCode()).toBe(n2.getHashCode());

    n.append("blub");

    expect(n.isEqual(n2)).toBe(false);
    expect(n2.isEqual(n)).toBe(false);
    expect(n.getHashCode()).not.toBe(n2.getHashCode());
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
