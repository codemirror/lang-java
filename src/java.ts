import {parser} from "@lezer/java"
import {flatIndent, continuedIndent, indentNodeProp, foldNodeProp, foldInside,
        LRLanguage, LanguageSupport} from "@codemirror/language"
import {styleTags, tags as t} from "@codemirror/highlight"

/// A language provider based on the [Lezer Java
/// parser](https://github.com/lezer-parser/java), extended with
/// highlighting and indentation information.
export const javaLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        IfStatement: continuedIndent({except: /^\s*({|else\b)/}),
        TryStatement: continuedIndent({except: /^\s*({|catch|finally)\b/}),
        LabeledStatement: flatIndent,
        SwitchBlock: context => {
          let after = context.textAfter, closed = /^\s*\}/.test(after), isCase = /^\s*(case|default)\b/.test(after)
          return context.baseIndent + (closed ? 0 : isCase ? 1 : 2) * context.unit
        },
        BlockComment: () => -1,
        Statement: continuedIndent({except: /^{/})
      }),
      foldNodeProp.add({
        ["Block SwitchBlock ClassBody ElementValueArrayInitializer ModuleBody EnumBody " +
         "ConstructorBody InterfaceBody ArrayInitializer"]: foldInside,
        BlockComment(tree) { return {from: tree.from + 2, to: tree.to - 2} }
      }),
      styleTags({
        null: t.null,
        instanceof: t.operatorKeyword,
        this: t.self,
        "new super assert open to with void": t.keyword,
        "class interface extends implements enum": t.definitionKeyword,
        "module package import": t.moduleKeyword,
        "switch while for if else case default do break continue return try catch finally throw": t.controlKeyword,
        ["requires exports opens uses provides public private protected static transitive abstract final " +
          "strictfp synchronized native transient volatile throws"]: t.modifier,
        IntegerLiteral: t.integer,
        FloatLiteral: t.float,
        "StringLiteral TextBlock": t.string,
        CharacterLiteral: t.character,
        LineComment: t.lineComment,
        BlockComment: t.blockComment,
        BooleanLiteral: t.bool,
        PrimitiveType: t.standard(t.typeName),
        TypeName: t.typeName,
        Identifier: t.variableName,
        "MethodName/Identifier": t.function(t.variableName),
        Definition: t.definition(t.variableName),
        ArithOp: t.arithmeticOperator,
        LogicOp: t.logicOperator,
        BitOp: t.bitwiseOperator,
        CompareOp: t.compareOperator,
        AssignOp: t.definitionOperator,
        UpdateOp: t.updateOperator,
        Asterisk: t.punctuation,
        Label: t.labelName,
        "( )": t.paren,
        "[ ]": t.squareBracket,
        "{ }": t.brace,
        ".": t.derefOperator,
        ", ;": t.separator
      })
    ]
  }),
  languageData: {
    commentTokens: {line: "//", block: {open: "/*", close: "*/"}},
    indentOnInput: /^\s*(?:case |default:|\{|\})$/
  }
})

/// Java language support.
export function java() {
  return new LanguageSupport(javaLanguage)
}
