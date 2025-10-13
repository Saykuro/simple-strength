# GitHub Copilot Instructions

## Code Quality and Workflow Rules

### Build, Test, and Lint Integrity

**CRITICAL RULE**: This rule must **ALWAYS** be followed for every task, feature, or bugfix.

Before any task is considered "complete", the following commands **MUST** be executed successfully without errors:

1.  **Build**: `pnpm build`
2.  **Test**: `pnpm test`
3.  **Lint**: `pnpm lint`
4.  **Type Check**: `pnpm typecheck`

### Failure Handling

**If ANY of the above commands fail:**

* The task is **NOT** complete.
* Issues **MUST** be fixed immediately.
* Code **CANNOT** be committed or merged until all commands pass successfully.
* No exceptions – build, test, and lint integrity is non-negotiable.

### Project Context

This is a Next.js project using:

* TypeScript
* pnpm package manager
* Biome for linting/formatting
* NextAuth for authentication
* tailwind for styling
* react-hook-form for forms
* tanstack-query for data fetching, caching, and state synchronization
* zod for validation
* zustand for state management
* jest for testing
* cypress for end-to-end testing

---

## Detailed Rules for Security, Stability, and Scalability

### Architecture and Modularity (SOLID & Clean Code)

* **Single Responsibility Principle (SRP)**: Every component, function, or module has exactly **one** responsibility.
    * Components are either for presentation (Presentational Components) or for logic (Container Components/Hooks). Do not mix them.
    * Functions should be short (ideally < 40 lines) and do only one thing.
* **Dependency Inversion Principle (DIP)**: Dependencies on external services (e.g., APIs) are encapsulated via abstractions (e.g., dedicated service classes or hooks like `useProducts`). Components never call `fetch` directly.
* **Don't Repeat Yourself (DRY)**: Reusable logic (e.g., date formatting, currency calculation) **must** be extracted into dedicated utility functions (`/lib/utils`).
* **Keep It Simple, Stupid (KISS)**: Always prefer the simplest, most readable solution. Avoid premature optimization or overly complex abstractions.
* **You Ain't Gonna Need It (YAGNI)**: Only implement functionality that is needed now. No speculative features.

### Security (Security by Design)

* **Validation at the Source**: EVERY external input (API request bodies, URL parameters, forms) **MUST** be validated server-side with **Zod**. Never trust data coming from the client.
* **Authentication & Authorization**: All API routes and server components that handle protected data **MUST** check the session using `getServerSession` from NextAuth. Access control is not optional.
* **Secrets Management**: Sensitive data (API keys, secrets) belong **exclusively** in environment variables (`process.env`). They must never be hardcoded. Ensure that `.env.local` is in `.gitignore`.
* **Output Escaping**: Next.js and React handle this automatically for the most part. However, be extremely cautious when using `dangerouslySetInnerHTML`.

### State Management (Zustand)

* **Granular Stores**: Create separate, small stores for logically distinct domains (e.g., `useUserStore`, `useCartStore`). Avoid a single, monolithic global store.
* **Use Selectors**: Always access parts of the state with selectors to prevent unnecessary re-renders.
    * **Good**: `const user = useUserStore(state => state.user);`
    * **Bad**: `const { user } = useUserStore();` (unless you need the entire state)
* **Logic in Actions**: Business logic (e.g., API calls, data manipulation) belongs in the store's actions, not in the components.

### Testing (Quality Assurance)

* **Unit Tests (Jest)**: Every utility function, custom hook, and complex store action **must** have unit tests.
* **Integration Tests (React Testing Library)**: Critical user flows (e.g., login, adding a product to the cart) must be covered by integration tests that test the interaction of multiple components.
* **End-to-End Tests (Cypress)**: The most important "happy paths" of the application (e.g., the entire checkout process) must be verified with Cypress tests.
* **Test-Driven Development (TDD)**: For new, complex logic (especially in hooks or services), a failing test should be written first.

### Error Handling and Logging

* **Robust API Calls**: Every asynchronous call (e.g., `fetch`) **must** be wrapped in a `try...catch` block or have a `.catch()` handler.
* **User-Facing Errors**: Show understandable error messages to the user. Never pass raw error stacks or technical details to the UI.
* **Error Boundaries**: Use React Error Boundaries to wrap critical parts of the UI and display a fallback component in case of an error, instead of letting the whole page crash.
* **Server-Side Logging**: All significant server-side errors (e.g., in API routes) **must** be logged (e.g., via Sentry, Pino).

### Code Style and Documentation

* **Self-Explanatory Code**: Code must be written to be understandable without comments. Name variables, functions, and components clearly and precisely.
* **Comments**: Avoid descriptive comments that explain *what* the code does (`// Loop over users`). Comments are only allowed in the following cases:
    1.  **Why**: To explain *why* a specific, unconventional solution was chosen (`// HACK: This is needed due to a bug in library X`).
    2.  **API Documentation**: JSDoc for exported functions in shared modules to document their usage.
    3.  **Linting Exceptions**: To justify why a Biome rule is disabled (`// biome-ignore lint/suspicious/noExplicitAny: <reason>`).
* **Strict Typing**: The use of `any` is forbidden. Use `unknown` for unsafe types and perform explicit type checking.
* **Linting and formating rules**: 
Formatter:
  Format with errors:           false
  Indent style:                 Space
  Indent width:                 2
  Line ending:                  LF
  Line width:                   120
  Attribute position:           Auto
  Bracket spacing:              unset

JavaScript Formatter:
  Enabled:                      unset
  JSX quote style:              Double Quotes
  Quote properties:             As needed
  Trailing commas:              ES5
  Semicolons:                   Always
  Arrow parentheses:            Always
  Bracket spacing:              true
  Bracket same line:            false
  Quote style:                  Single Quotes
  Indent style:                 unset
  Indent width:                 unset
  Line ending:                  unset
  Line width:                   unset
  Attribute position:           Auto
Linter:
  JavaScript enabled:           unset
  JSON enabled:                 unset
  CSS enabled:                  unset
  GraphQL enabled:              unset
  Recommended:                  true
  Enabled rules:
    a11y/noAccessKey
    a11y/noAriaHiddenOnFocusable
    a11y/noAriaUnsupportedElements
    a11y/noAutofocus
    a11y/noDistractingElements
    a11y/noHeaderScope
    a11y/noInteractiveElementToNoninteractiveRole
    a11y/noLabelWithoutControl
    a11y/noNoninteractiveElementToInteractiveRole
    a11y/noNoninteractiveTabindex
    a11y/noPositiveTabindex
    a11y/noRedundantAlt
    a11y/noRedundantRoles
    a11y/noStaticElementInteractions
    a11y/noSvgWithoutTitle
    a11y/useAltText
    a11y/useAnchorContent
    a11y/useAriaActivedescendantWithTabindex
    a11y/useAriaPropsForRole
    a11y/useAriaPropsSupportedByRole
    a11y/useButtonType
    a11y/useFocusableInteractive
    a11y/useGenericFontNames
    a11y/useHeadingContent
    a11y/useHtmlLang
    a11y/useIframeTitle
    a11y/useKeyWithClickEvents
    a11y/useKeyWithMouseEvents
    a11y/useMediaCaption
    a11y/useSemanticElements
    a11y/useValidAnchor
    a11y/useValidAriaProps
    a11y/useValidAriaRole
    a11y/useValidAriaValues
    a11y/useValidAutocomplete
    a11y/useValidLang
    complexity/noAdjacentSpacesInRegex
    complexity/noArguments
    complexity/noBannedTypes
    complexity/noCommaOperator
    complexity/noEmptyTypeParameters
    complexity/noExtraBooleanCast
    complexity/noFlatMapIdentity
    complexity/noImportantStyles
    complexity/noStaticOnlyClass
    complexity/noThisInStatic
    complexity/noUselessCatch
    complexity/noUselessConstructor
    complexity/noUselessContinue
    complexity/noUselessEmptyExport
    complexity/noUselessEscapeInRegex
    complexity/noUselessFragments
    complexity/noUselessLabel
    complexity/noUselessLoneBlockStatements
    complexity/noUselessRename
    complexity/noUselessStringRaw
    complexity/noUselessSwitchCase
    complexity/noUselessTernary
    complexity/noUselessThisAlias
    complexity/noUselessTypeConstraint
    complexity/noUselessUndefinedInitialization
    complexity/useArrowFunction
    complexity/useDateNow
    complexity/useFlatMap
    complexity/useIndexOf
    complexity/useLiteralKeys
    complexity/useNumericLiterals
    complexity/useOptionalChain
    complexity/useRegexLiterals
    complexity/useSimpleNumberKeys
    correctness/noChildrenProp
    correctness/noConstAssign
    correctness/noConstantCondition
    correctness/noConstantMathMinMaxClamp
    correctness/noConstructorReturn
    correctness/noEmptyCharacterClassInRegex
    correctness/noEmptyPattern
    correctness/noGlobalObjectCalls
    correctness/noInnerDeclarations
    correctness/noInvalidBuiltinInstantiation
    correctness/noInvalidConstructorSuper
    correctness/noInvalidDirectionInLinearGradient
    correctness/noInvalidGridAreas
    correctness/noInvalidPositionAtImportRule
    correctness/noInvalidUseBeforeDeclaration
    correctness/noMissingVarFunction
    correctness/noNonoctalDecimalEscape
    correctness/noPrecisionLoss
    correctness/noSelfAssign
    correctness/noSetterReturn
    correctness/noStringCaseMismatch
    correctness/noSwitchDeclarations
    correctness/noUnknownFunction
    correctness/noUnknownMediaFeatureName
    correctness/noUnknownProperty
    correctness/noUnknownPseudoClass
    correctness/noUnknownPseudoElement
    correctness/noUnknownTypeSelector
    correctness/noUnknownUnit
    correctness/noUnmatchableAnbSelector
    correctness/noUnreachable
    correctness/noUnreachableSuper
    correctness/noUnsafeFinally
    correctness/noUnsafeOptionalChaining
    correctness/noUnusedFunctionParameters
    correctness/noUnusedImports
    correctness/noUnusedLabels
    correctness/noUnusedPrivateClassMembers
    correctness/noUnusedVariables
    correctness/noVoidElementsWithChildren
    correctness/noVoidTypeReturn
    correctness/useGraphqlNamedOperations
    correctness/useIsNan
    correctness/useParseIntRadix
    correctness/useValidForDirection
    correctness/useValidTypeof
    correctness/useYield
    performance/noAccumulatingSpread
    performance/noDynamicNamespaceImportAccess
    security/noBlankTarget
    security/noDangerouslySetInnerHtml
    security/noDangerouslySetInnerHtmlWithChildren
    security/noGlobalEval
    style/noDescendingSpecificity
    style/noNonNullAssertion
    style/useArrayLiterals
    style/useConst
    style/useDeprecatedReason
    style/useExponentiationOperator
    style/useExportType
    style/useImportType
    style/useLiteralEnumMembers
    style/useNodejsImportProtocol
    style/useShorthandFunctionType
    style/useTemplate
    suspicious/noApproximativeNumericConstant
    suspicious/noArrayIndexKey
    suspicious/noAssignInExpressions
    suspicious/noAsyncPromiseExecutor
    suspicious/noBiomeFirstException
    suspicious/noCatchAssign
    suspicious/noClassAssign
    suspicious/noCommentText
    suspicious/noCompareNegZero
    suspicious/noConfusingLabels
    suspicious/noConfusingVoidType
    suspicious/noConstEnum
    suspicious/noControlCharactersInRegex
    suspicious/noDebugger
    suspicious/noDocumentCookie
    suspicious/noDoubleEquals
    suspicious/noDuplicateAtImportRules
    suspicious/noDuplicateCase
    suspicious/noDuplicateClassMembers
    suspicious/noDuplicateCustomProperties
    suspicious/noDuplicateElseIf
    suspicious/noDuplicateFields
    suspicious/noDuplicateFontNames
    suspicious/noDuplicateJsxProps
    suspicious/noDuplicateObjectKeys
    suspicious/noDuplicateParameters
    suspicious/noDuplicateProperties
    suspicious/noDuplicateSelectorsKeyframeBlock
    suspicious/noEmptyBlock
    suspicious/noEmptyInterface
    suspicious/noExplicitAny
    suspicious/noExtraNonNullAssertion
    suspicious/noFallthroughSwitchClause
    suspicious/noFunctionAssign
    suspicious/noGlobalAssign
    suspicious/noGlobalIsFinite
    suspicious/noGlobalIsNan
    suspicious/noImplicitAnyLet
    suspicious/noImportAssign
    suspicious/noImportantInKeyframe
    suspicious/noIrregularWhitespace
    suspicious/noLabelVar
    suspicious/noMisleadingCharacterClass
    suspicious/noMisleadingInstantiator
    suspicious/noMisrefactoredShorthandAssign
    suspicious/noOctalEscape
    suspicious/noPrototypeBuiltins
    suspicious/noQuickfixBiome
    suspicious/noRedeclare
    suspicious/noRedundantUseStrict
    suspicious/noSelfCompare
    suspicious/noShadowRestrictedNames
    suspicious/noShorthandPropertyOverrides
    suspicious/noSparseArray
    suspicious/noSuspiciousSemicolonInJsx
    suspicious/noTemplateCurlyInString
    suspicious/noThenProperty
    suspicious/noTsIgnore
    suspicious/noUnknownAtRules
    suspicious/noUnsafeDeclarationMerging
    suspicious/noUnsafeNegation
    suspicious/noUselessEscapeInString
    suspicious/noUselessRegexBackrefs
    suspicious/noWith
    suspicious/useAdjacentOverloadSignatures
    suspicious/useBiomeIgnoreFolder
    suspicious/useDefaultSwitchClauseLast
    suspicious/useGetterReturn
    suspicious/useGoogleFontDisplay
    suspicious/useIsArray
    suspicious/useIterableCallbackReturn
    suspicious/useNamespaceKeyword

---

### use Context7
Always use context7 when I need code generation, setup or configuration steps, or
library/API documentation. This means you should automatically use the Context7 MCP
tools to resolve library id and get library docs without me having to explicitly ask.

### Extended Development Workflow

1.  Make code changes according to the principles above.
2.  Write or update the necessary tests (unit, integration).
3.  Ensure error handling is implemented.
4.  Run the validation suite:
    * `pnpm build` – Must pass.
    * `pnpm test` – Must pass, all tests must pass.
    * `pnpm lint` – Must pass, no linting errors.
    * `pnpm typecheck` – Must pass, no TypeScript errors.
5.  Write a meaningful commit message.
6.  **Only then** is the task considered complete and ready for a pull request.

**Remember: Quality is the result of a disciplined process. No shortcuts.**