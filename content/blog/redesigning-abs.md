+++
title = "Redesigning ABS"
description = "How can a language such as ABS, specifically designed to be analyzed, be improved? What effect does the type system have on verifiability? What mistakes were made in this regard with ABS?"
date = 2023-10-05
draft = true

[taxonomies]
tags = ["Computer Science"]
+++

Recently, I was tasked to implement multiple extensions and analyses of ABS in the compiler as part of my bachelor's thesis. The goal was to reduce the effort necessary to prove properties of ABS models and analyze them easier. How successful this was, and how it was achieved can be read in my Bachelor thesis. This post aims to add some general thoughts on the design of ABS and some of the errors I see, that harm further analysis of ABS.

ABS is a programming language with a very peculiar focus: it aims to model concurrent, object-oriented, distributed, behavior. As the [ABS website](https://abs-models.org/) explains:

> ABS is a language for Abstract Behavioral Specification, which combines implementation-level specifications with verifiability, high-level design with executablity, and formal semantics with practical usability. ABS is a concurrent, object-oriented, modeling language that features functional data-types.

As the syntax, and some language concepts such as interfaces and classes, make clear, ABS took inspiration from Java for its object-oriented features, merely extending them with abstract data types (lists, maps, sets, etc.).

In some language aspects, it is clear that the designers of the language paid particular attention to the impact on analysis. For instance, return statements may only exists at the end of each method, making it easier to determine returned values when analyzing. This attention to analysis is clear throughout the language. However, there are some instances in which too much of the semantics of other languages was borrowed, leaving us with some major holes in analysis.

In this article, I attempt to give a reasonable overview of these issues, and propose alternative designs. I will not concern myself with problems such as backwards-compatibility. The goal is not to actually change ABS, but rather to seriously consider how to design a language made for analysis and verification.

## Abstract Data Types vs. Interfaces

As mentioned above, ABS includes both abstract data types and objects (through classes and interfaces). How these two very different approaches to a type system work together is, however, not ideal. Indeed, abstract data types were a later addition rather than an initial feature.

The first noticeable difference between the two is how operations are called on the two paradigms. While operations on interfaces allow for the traditional Java-like postfix call, abstract data types can define no methods. As a result, all operations on abstract data types must be defined in functions, as shown in the code below:

```abs
interface MyInterfaceList {
  Item get(Int i);
}

data MyADTList<T> = Link(T) | None

def T get<T>(MyADTList<T> list, Int i) = ...;

{
  MyInterfaceList il = ...;
  MyADTList<Item> ia = ...;

  Item i1 = il.get(4);
  Item i2 = get(ia, 4);
}
```

At first glance, this difference in syntax is no problem at all. In fact, it has some advantages due to ABS' semantics: function calls are pure expressions and therefore can be used in more places; they also can be nested. Method calls cannot be chained in ABS. And the syntax clearly has no effect whatsoever on analyzing a program. So what's the issue here?

The first issue may be minor, but it could have a major impact: Many developers are not keen on such function calls. Method calls, especially method chaining seems to be much more popular to compute values. It is quite easy to guess why, since methods are much more readable and it is easier to discern the order of operations. Compare the readability of the following examples, this time in JavaScript, which supports both styles:

```js
const r1 = add1(sub2(mul2(div4(pow3(value)))));

const r2 = value.pow3().mul2().sub(2).add1();
```

Due to this difference, many developers may be reluctant to use abstract data types and especially to use them for critical parts of their program. To make a language feature useful and widespread, we clearly have to concern ourselves with its syntax.

Another effect of the design of abstract data types is the lack of modularity and encapsulation. All parts of an abstract data type are always public and functions can be spread throughout the entire model. As a result, any change to the abstract data type may break all functions using it and all dependent code. For most languages, this limitation would be critical. However, ABS is not concerned with such high-level problems of code management, as can be discerned from the lack of package management. This is, therefore, more of an annoyance than a severe problem, but we might still consider eliminating or alleviating it.

My proposal for a better interaction between interfaces and abstract data types is **not** a change in syntax or the addition of a feature. Instead, i propose eliminating the distinction entirely. Rather than relying in a mixture of weaker Java-interfaces and clumsy Haskell-functions, we would rely on _structs_ and _enums_, as implemented in Rust --- in fact, borrowing aspects from Rust while simplifying and adapting them will be the main approach taken in this article. Rust, in my opinion, is an excellently designed language ([and many developers seem to agree](https://www.techjuice.pk/stack-overflow-developer-survey-2020-rust-is-the-most-loved-programming-language-vba-the-most-dreaded/)). It's features also seem to lend themselves well for analysis and verification.[^borrowck]

Structs in Rust provide an excellent alternative to interfaces. They definition of fields _only_ contains the definition of the fields, clearly showing the data of a struct. Functionality is then contained in implementation-blocks. This keeps a clear distinction between data and methods. A simple example is below:[^book]

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}
```

In addition, ABS' abstract data types can be covered by Rust's enums:

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

impl Message {
  fn call(&self) {
    // method body would be defined here
  }
}
```

Methods for both structs and enums are called just like for Java interfaces, i.e., `ref.method(param1, param2)`. And both language features support generics. Combined with method chaining, this would allow for great flexibility in our models. Rust features like pattern matching are already part of ABS, allowing for similar usability.

Incidentally, this proposal would make a large part of my thesis unnecessary. The main block of my work was to analyze ABS models for nullability of references, since they can be `null` --- just like in Java. As I noted in my thesis, it would be possible to remove `null` altogether and rely on the abstract data type `Maybe` to represent optional values. I decided against this, as breaking a major aspect of the language was beyond the scope of my work. The more important reason for me was, however, that using `Maybe` is a rather unpopular option in ABS, since I encountered very little code actually using it. I suspect, this was due to the limitations of abstract data types mentioned above. Using enums, with their ergonomic methods, and in particular the `Option` enum, would be a great alternative here and finally allow us to remove `null` from the language. `Option` is essentially Rust's version of maybe, although with many useful methods.

Before we talk about some problems we need to solve, let us quickly recap all changes so far. As we will continue to list the changes throughout, new changes will be **bold**:

- **Remove abstract data types, interfaces and classes**
- **Add structs and enums**
- **Add common Rust enums and struct, such as `Option`**

### Active Objects

Even though I firmly believe that the above changes would be a better design, we so far have done little to improve analysis and verification and have removed some important ABS features. First, we consider the feature gap.

Though structs do in fact cover the vast majority of features currently belonging to classes, there is (at least) one important difference: Classes in ABS represent active objects and are running on **C**oncurrent **O**bject **G**roups (COGs), where only one process, i.e., active object, may run at a time. Just as in Java, objects are instantiated with the `new` keyword. ABS adds the extra `local` keyword to differentiate between creating an object on the same COG, i.e., `local`, or an a different COG.

```abs
{
  I near = new local C(param);
  I far = new C(param);
}
```

The challenge, then, is to incorporate these features into the struct proposal. My solution here is to solve another feature we lost: interfaces. Structs may map onto classes and objects, and --- since they do not allow for inheritance --- they in many places reduce the usage of interfaces, but we still may want to encapsulate similar functionality into units. Instead of interfaces, I propose to use _traits_. Traits are already used in ABS (although scarcely), but to improve them we again look to Rust:

```rust
pub trait Summary {
    fn summarize(&self) -> String;
}

pub struct NewsArticle {
    pub headline: String,
    pub location: String,
    pub author: String,
    pub content: String,
}

impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("{}, by {} ({})", self.headline, self.author, self.location)
    }
}

pub struct Tweet {
    pub username: String,
    pub content: String,
    pub reply: bool,
    pub retweet: bool,
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("{}: {}", self.username, self.content)
    }
}
```

Traits allows us to solve the issue of active object instantiation. We can introduce a trait such as `ActiveObject` that can be implemented by structs (or even enums) to create a new instance on a COG. This trait then allows us to call methods asynchronously on these values. All structs implementing this trait can then add constructors. Simply using the Rust trait semantics is not adequate here, as we want to create constructors with parameters which the trait knows nothing about. We have to check for correct constructors during compilation, which we already do anyway. The `new`/`new local` syntax is unnecessary if we copy the static methods from Rust (as we should), but we may add it as syntactic sugar.

With this approach the following ABS example...

```abs
class DataBase(Map<Filename,File> db) implements DB {
	File getFile(Filename fId) {
		return lookup(db, fId);
	}

	Int getLength(Filename fId){
		return length(lookup(db, fId));
	}

	Unit storeFile(Filename fId, File file) {
		db = insert(Pair(fId,file), db);
	}

	Filenames listFiles() {
		return keys(db);
	}
}
```

...becomes this:

```rabs
struct DataBase {
  Map<Filename, File> db,
}

// The normal methods
impl DataBase {
  Option<File> getFile(Filename fId) {
    return this.db.lookup(fId);
  }

  Option<Int> getLength(Filename fId) {
    // If we allow such higher order functions,
    // otherwise use match
    return this.getFile(fId).map(File::length);
  }

  Unit storeFile(Filename fId, File file) {
    this.db.insert(fId, file);
  }

  Filenames listFiles() {
    return this.db.keys();
  }
}

impl ActiveObject for DataBase {
  // We may choose another name, perhaps even `new`
  This create(Map<Filename, File> db) {
    return This {
      db: db
    };
  }
}
```

Note that we assume the `This` type is similar to `Self` in Rust. Some improvements here are possible. We may use the function syntax of Rust where the return type comes at the end, though this is highly subjective (I would prefer it, personally). We may switch to `self` rather than `this`, though this is especially unnecessary. We also may make it easier to create a constructor which simply fills the fields by borrowing Rust's `derive` attribute. The overall approach remains the same.

With this setup, how do method calls on active objects work? Well, here the Rust-equivalence stops. To truly model ABS' semantics, we have to take a radical approach here: Synchronous method calls are only possible when the `Sync` trait is implemented. This trait is implemented by all structs by default, thought this becomes invalidated when `ActiveObject` is implemented. All `ActiveObjects` do, however, implement `Async`, allowing asynchronous method calls. The following code example demonstrates this:

```rabs
struct A { ... }

struct B { ... }

impl ActiveObject for A { ... }

A a = ...;
B b = ...;

// Not allowed, A implements ActiveObject
a.m();

// Allowed
b.m();

// Allowed, as A implements ActiveObject
Fut<Unit> = a!m();

// Not allowed
b!m();
```

Through this, there is a hard distinction between normal structs and active objects. However, ABS allows us to call local (i.e., near) objects synchronously. To allow this, we introduce the `Local` wrapper, which implements `Sync` and allows us to again call all implemented methods. To get such a `Local` instance we must call the `asLocal` method implemented on `ActiveObject`, which returns `None` if the object is on a different COG.

```rabs
struct A { ... }

impl ActiveObject for A { ... }

impl B {
  Unit m(A a) {
    Option<Local<A>> la = a.asLocal();
    // Now this is allowed
    a.m();
  }
}
```

If we want to ensure that the parameter `a` is always near and, therefore, save us the runtime-check, we can use `Local` directly:

```rabs
impl B {
  Unit m(Local<A> a) {
    // Now this is allowed
    a.m();
  }
}
```

Other extensions for location types, as discussed in my thesis, can be included, but this covers the most important cases.

[^borrowck]: One might argue that this is shown by the amount of analysis provided by the compiler. The borrow-checker alone presents an immense example. There is also ongoing work for [verification in Rust](https://rust-lang-nursery.github.io/wg-verification/).

[^book]: Rust examples taken from the excellent [Rust book](https://doc.rust-lang.org/book/title-page.html). Types like `i32` or `u32` are Rust's version of `Int`. Being a systems language, Rust allows us to be more specific regarding the size of integers. This would be unnecessary for a language such as ABS.
