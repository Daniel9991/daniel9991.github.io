---
title: "Using recursion in web development"
pubDate: 2026-01-31
author: "Daniel Fernandez"
---
In my regular work as a web developer using JS/TS I tend to use more or less the same things: objects, maps and arrays. I mainly display data conditionally, map or filter items in arrays and communicate through Promises or async/await to manage data. But sometimes I do find ways to connect my daily work with Computer Science concepts I learned in school. In this post, that concept is **recursion**.

You've probably heard of it if you do some programming. Many people use it regularly and do some powerful things with it. But for some of us, it is hard to understand at first. According to [Wikipedia](https://en.wikipedia.org/wiki/Recursion)
> (recursion) occurs when the definition of a concept or process depends on a simpler or previous version of itself

In programming, this can be mostly seen by having a function that calls itself when doing some processing. The mental model is about solving a problem by decomposing it into smaller chunks and finding partial solutions. Then in the end they are all combined to return the final value. This is how I have interpreted it. You can probably find better explanations online.

## My Problem
I was working on a Next.js website where the client wanted to show a description for their products. That description needed to have some emphasized (bold) words. Inside the form to create/edit products, there was a `<textarea>` for my client to enter and modify the description. But now I had to provide a way for my client to emphasize certain words from that `<textarea>`. What came to my mind was having them wrap words or phrases that needed emphasizing between a pair of `**` (like in Markdown). 

This was not enough, the website would still render this as a regular text showing the ** and nothing in bold. The whole thing was saved in the database as text value. And I had to transform it in my frontend to display the emphasized words correctly.

Thinking back, this could have been solved by using some library to render the description as Markdown (lesson learned there). But in that moment what came to my mind was parsing it myself, coverting the strings wrapped by `**` into `<span className="font-bold">...</span>`.

## How I approached it?
So I had to do this transformation for 1+ (or none) substrings in each description. I knew my best friend here would be RegExp. I know next to nothing about it, but ChatGPT helped me come up with the expression for "anything between ** and **". I could have set up a while loop to convert those substrings while `description.search(regExp)` returned something. But that's not what my brain saw. It interpreted it as a recursive problem:
"The way to convert the description is to find the first ocurrence of emphasized text, convert it, and concatenate to it the result of converting the remaining description."
In practice, it would look like this:
```js
emphasizeDescription(description){
    get first occurrence of substring to emphasize
    if there is no substring to emphasize{
        return description
    }

    split description into 3 parts -> (
      already processed text,
      substring to emphasize,
      remaining description that has not yet been analyzed
    )

    convert the substring into emphasized jsx

    return (
      previous processed description +
      current emphasized substring + 
      emphasizeDescription(remaining description)
    )
}
```
To use recursion and not mess it up, you need to define a *base case*. This is the moment when the problem can be no longer decomposed, and you return a value. In my example, the base case was processing a text that didn't have any substring to emphasize. So I would just return the same text I had received. The next function call in the stack would receive the returned text, and concatenate it to the already transformed part of the description.

## Where did it get tricky?
I had to convert a string into valid ReactNode items for my component to render them. The part of the description that didn't need to be emphasized, could be kept as strings. The ones that did get converted, would be JSX. So my final response would be of type `Array<ReactNode>`. My input was a string, my return was an array. 

```ts

type ReactNodeWithStringLast = [...ReactNode[], string];

function emphasizeProductDescription(
  description: ReactNodeWithStringLast
): ReactNode {
  ...
}
```

My base case looked like:

```js

  ...
  // Early return in case there is nothing to process
  if(description.length === 0) return description;

  const regex = /\*\*(.*?)\*\*/

  // In the data model, the last element
  // of the array (always a string)
  // is the part of the description that hasn't been processed yet
  const lastString = description[description.length - 1];
  
  // Getting the next occurrence of text to emphasize
  const index = lastString.search(regex)

  // If no occurrence is found,
  // return the description as it currently is
  if(index === -1) return [...description];
  const match = lastString.match(regex);
  if(!match) return [...description];

  ...
```

If there was indeed something that needed emphasizing, I had then to dissect that last string in 3 parts:
1. everything from the start of the string right up to the substring to be emphasized (this is a string)
2. the substring to emphasize (this is a string to be turned into JSX)
3. everything that came after that substring (this is a string)

The remaining of it was putting all back into a new description array and call the function again to check if the last part of the array still needs emphasizing or not.

```js
  ...
  // Separate the all that has already been processed
  const before = lastString.slice(0, index);
  
  // Separate all that will not be processed in this call
  const after = lastString.slice(index + match[0].length);

  // Get all from description that was processed in a previous call
  const previouslyProcessedDescription = description
    .slice(0, description.length - 1);
  
  // Assemble everything into the new Array
  const newDescription: ReactNodeWithStringLast = [
    ...previouslyProcessedDescription,
    before,
    <span className="font-semibold">{match[1]}</span>,
    after
  ];

  return emphasizeProductDescription(newDescription);
}
```
The result of this function would look somthing like `[string, jsx, string, jsx, ...]`

For example, the function was used like this:
```js
<div>
  ...
  {product.description && (
    <p className="text-dark-blue-text text-[0.9rem] leading-[1.25rem] mt-4">
      {emphasizeProductDescription([product.description])}
    </p>
  )}
  ...
</div>
```

and the description: 
`Crea un **cake** a tu gusto, escogiendo **cantidad de capas**, de **rellenos**, y **diámetro**. Tú lo imaginas, nosotros lo hacemos realidad.`
resulted in:
<image width="400px" style="margin:40px auto;" src="images/post-1/cake_with_emph_desc.png">


## What did I learn with this?
1. When facing a problem which is not straight forward, don't jump into action just yet. Take a moment to evaluate all options. In hindsight, using a library to parse the description as Markdown might have been easier. Many times, implementing things yourself isn't the best option.
2. I can use the rest operator in TypeScript (I used this to define the type of the parameter for the function). It was useful because it allowed me to specify that the last element of the array is a string. Typing it as ReactNode[] didn't ensure for TypeScript that the last element would be a string. I didn't know I could do something like this and only makes me wonder how many more things I need to learn from TypeScript.

## In the end
I removed this feature, as the customer decided not to show the description like that. It was a fun experiment though. I got to apply a concept from my school courses and the CS universe to the mostly monotonous web development I had been doing. Recursion might not always be the answer, but maybe it can help you out at some point. 