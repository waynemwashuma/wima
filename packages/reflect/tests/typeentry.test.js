import { test, describe } from "vitest";
import { strictEqual } from "node:assert";
import { StructInfo } from "../src/core";
import { MethodEntry, TypeEntry } from "../src/resources";
import { setTypeId, typeid } from "@wimaengine/type";

describe("Testing `TypeEntry` method registry", () => {
  test("`TypeEntry` defaults constructorFn to undefined", () => {
    const entry = new TypeEntry(StructInfo.default());

    strictEqual(entry.constructorFn, undefined);
  });

  test("`TypeEntry` stores constructorFn when provided", () => {
    class Test {}

    const entry = new TypeEntry(StructInfo.default(), Test);

    strictEqual(entry.constructorFn, Test);
  });

  test("`TypeEntry` can set and get methods", () => {
    /**
     * @param {number} a
     * @param {number} b
     */
    function add(a, b) {
      return a + b;
    }

    const entry = new TypeEntry(StructInfo.default());
    entry.setMethod(add);

    const method = entry.getMethod("add");
    strictEqual(method instanceof MethodEntry, true);
    strictEqual(method?.call([2, 3]), 5);
  });

  test("`TypeEntry` can call methods by name", () => {
    /**
     * @param {number} a
     * @param {number} b
     */
    function multiply(a, b) {
      return a * b;
    }

    const entry = new TypeEntry(StructInfo.default());
    entry.setMethod(multiply);

    strictEqual(entry.call("multiply", [4, 5]), 20);
  });

  test("`TypeEntry` can return all methods", () => {
    /**
     * @param {number} a
     * @param {number} b
     */
    function add(a, b) {
      return a + b;
    }

    /**
     * @param {number} a
     * @param {number} b
     */
    function multiply(a, b) {
      return a + b;
    }

    const entry = new TypeEntry(StructInfo.default());
    entry.setMethod(add);
    entry.setMethod(multiply);

    const methods = entry.getMethods();
    strictEqual(methods.size, 2);
    strictEqual(methods.get("add") instanceof MethodEntry, true);
    strictEqual(methods.get("multiply") instanceof MethodEntry, true);
  });

  test("`TypeEntry` returns undefined for missing methods", () => {
    const entry = new TypeEntry(StructInfo.default());

    strictEqual(entry.call("missing", [1]), undefined);
    strictEqual(entry.getMethod("missing"), undefined);
  });
});

describe("Testing `TypeEntry` attribute registry", () => {
  class SnapshotType {
    constructor(snapshotTypeId) {
      this.snapshotTypeId = snapshotTypeId;
    }
  }

  test("`TypeEntry` stores and reads attributes by constructor", () => {
    const entry = new TypeEntry(StructInfo.default());
    const attribute = new SnapshotType(typeid(String));

    strictEqual(entry.setAttribute(attribute), entry);
    strictEqual(entry.getAttribute(SnapshotType), attribute);
    strictEqual(entry.hasAttribute(SnapshotType), true);
  });

  test("`TypeEntry` stores and reads attributes by type ID", () => {
    const entry = new TypeEntry(StructInfo.default());
    const attribute = { snapshotTypeId: typeid(Number) };
    const attributeTypeId = setTypeId("SnapshotType");

    strictEqual(entry.setAttributeByTypeId(attributeTypeId, attribute), entry);
    strictEqual(entry.getAttributeByTypeId(attributeTypeId), attribute);
    strictEqual(entry.hasAttributeByTypeId(attributeTypeId), true);
  });

  test("`TypeEntry` replaces attributes with the same type ID", () => {
    const entry = new TypeEntry(StructInfo.default());
    const first = new SnapshotType(typeid(String));
    const second = new SnapshotType(typeid(Number));

    entry.setAttribute(first);
    entry.setAttribute(second);

    strictEqual(entry.getAttribute(SnapshotType), second);
  });

  test("`TypeEntry` removes attributes by constructor and type ID", () => {
    const entry = new TypeEntry(StructInfo.default());
    const attribute = new SnapshotType(typeid(String));
    const explicitTypeId = setTypeId("ExplicitAttribute");

    entry.setAttribute(attribute);
    entry.setAttributeByTypeId(explicitTypeId, attribute);

    strictEqual(entry.removeAttribute(SnapshotType), true);
    strictEqual(entry.hasAttribute(SnapshotType), false);
    strictEqual(entry.removeAttributeByTypeId(explicitTypeId), true);
    strictEqual(entry.hasAttributeByTypeId(explicitTypeId), false);
    strictEqual(entry.removeAttributeByTypeId(explicitTypeId), false);
  });
});
