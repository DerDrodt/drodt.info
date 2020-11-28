---
title: Redesigning ABS
description: How can a language such as ABS, specifically designed to be analyzed, be improved? What effect does the type system have on verifiability? What mistakes were made in this regard with ABS?
tags: Computer Science, Language Design, ABS, Type System
draft: true
---

Recently, I was tasked to implement multiple extensions and analyses of ABS in the compiler. The goal was to reduce the effort necessary to prove properties of ABS models and analyze them easier. How successful this was, and how it was achieved can be read in my Bachelor thesis. This post aims to add some general thoughts on the design of ABS and some of the errors I see, that harm further analysis of ABS.

ABS is a programming language with a very peculiar focus: it aims to model concurrent, object-oriented, distributed, behavior. As the [ABS website](https://abs-models.org/) explains:

> ABS is a language for Abstract Behavioral Specification, which combines implementation-level specifications with verifiability, high-level design with executablity, and formal semantics with practical usability. ABS is a concurrent, object-oriented, modeling language that features functional data-types.

As the syntax, and some language concepts such as interfaces and classes, make clear, ABS took inspiration from Java for its object-oriented features, merely extending them with abstract data types (lists, maps, sets, etc.).

In some language aspects, it is clear that the designers of the language paid particular attention to the impact on analysis. For instance, return statements may only exists at the end of each method, which makes it easier to determine returned values when analyzing. This attention to analysis is clear throughout the language. However, there are some instances in which too much of the semantics of other languages was borrowed, leaving us with some major holes in analysis.

## Abstract Data Types vs. Interfaces

As mentioned above, ABS includes both abstract data types and objects (through classes and interfaces). How these two very different approaches to a type system work together is, however, not ideal.

The first important difference between the two is how operations called on the two paradigms.

```abs
def Int f(List<Int> l) = length(l);
```
