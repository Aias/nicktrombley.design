---
date: 2020-01-19
title: refactoring barnsworthburning
published: false
---

I’m going to try and keep a semi-real-time journal of my design and development process, as I make some pretty significant structural changes to my open-source commonplace book, [barnsworthburning.net][barns].
(And if you’re reading this and you’re not keeping your own [commonplace book][commonplace] in some form, I can only tell you how much the habit of recording new and interesting information has enriched my own life since first encountering the idea in Alan Fletcher’s *[The Art of Looking Sideways][sideways]* over ten years ago.)

The site as it stands has evolved slowly and organically from what was originally a paper ritual, as I would hand-transcribe excerpts from books I read into a [Moleskine notebook][moleskine], with little structure beyond headings for the author and title, and sometimes page numbers (though I eventually stopped worrying about those too).
Though the handwritten process was more personal, and I suppose emotionally deeper, I eventually realized that it was just too much physical effort to do it for more than a few paragraphs per book, and decided to look for a digital solution.

Which brought me to [Evernote][evernote].
And I’ve loved Evernote. For almost five years now it has quietly and efficiently captured the words (and images – another benefit of moving away from paper) that make up my network of knowledge.
The network part is important. Most people I talk to who use Evernote completely ignore its tagging functionality, but it’s the kind of thing you have to either go all-in on or leave alone entirely. My approach has been the former, and it pays off.

![A screenshot of my ‘Tags’ page on Evernote, which lets me quickly jump to all the notes I’ve ever taken related to a particular idea. I didn’t notice until I took this screenshot that when you highlight a tag, it also highlights all other tags which have notes in common. Brilliant.][tags]

I’ve gotten better (read: more obsessive) about tagging as the process has matured, but even with a lot of untagged notes from the early years, I believe my total number of tags easily tops the total number of notes. The relationships are as important as the ideas themselves.

Evernote has been a huge part of my intellectual, professional, and sometimes personal life for a long time now. It has provided a foundation of ideas for almost every lecture and essay I’ve written in the last five years.
(On the other hand, sometimes I fear that I can’t think at all these days except in collections of pithy [fragments][fragments], loosely related.)
But [all useful things have an expiration date][byron], and around the time last year when I was leaving Epic and looking towards my next job, I had the idea that maybe this thing I’ve put so much of my time and energy into might also be a thing others would find interesting. Maybe someone else might even learn something new.

Which brings us to `barnsworthburning.net`.
I’ve actually owned the domain since sometime around 2014, when it was home to a terrible little personal site – my first ventures into web development and design.
The name is a reference to Haruki Murakami’s short story, *[Barn Burning][murakami]* (as part of his wonderful short story collection, *The Elephant Vanishes*), which used to be quite a bit more obscure than it is now, since Chang-dong Lee’s [film adaptation][burning] was released in 2018.
(And the top-level domain of `.net` may seem an odd choice until you realize that those are also my initials: **N**icholas **E**dward **T**rombley. Given that I eventually ended up doing web design and development, does this count as an [aptronym][aptronym]?)
Anyway, it wasn’t until 2019 that the site got its first major overhaul, when I totally gutted it to make room for the commonplace book it is today. As a design / development artifact, still terrible, but maybe a bit more refined form of terrible.
The original idea was actually to have it be a kind of strange hybrid of portfolio site, personal blog, and commonplace book, but that goal was pretty quickly abandoned in favor of what are now [three][netdotdesign] [different][innocent] [sites][barns].

![An early mockup of barnsworthburning.net, with room for a blog, a projects list, and an About page][mockup]

And I have a feeling that these sites are eventually going to end up coming back together in some way, but when you’re jobless and desperate it seems more impressive to have three medium-sized projects to talk about as opposed to one big one. And they’re all lovable in their own ways.

Right now, the site is built using [Sapper], which is basically Richard Harris’s answer to Next.js, but using Svelte instead of React.
Svelte (and Sapper) are an absolute dream to work with, and I absolutely loved using them to build the first iteration of my web-based commonplace book. But I’ve started to run into some challenges of scale that I didn’t see coming.

[barns]: https://barnsworthburning.net
[innocent]: https://the-innocent-i.net
[netdotdesign]: https://nicktrombley.design
[sideways]: https://www.goodreads.com/book/show/15778.The_Art_of_Looking_Sideways
[evernote]: https://evernote.com/blog/taking-note-commonplace-books/
[commonplace]: https://en.wikipedia.org/wiki/Commonplace_book
[moleskine]: https://us.moleskine.com/classic-notebook-black/p0460
[tags]: https://res.cloudinary.com/aias/image/upload/v1579365923/commonplace/evernote-tags.png
[notes]: https://res.cloudinary.com/aias/image/upload/v1579365922/commonplace/notes-about-notes.png
[airtable]: https://res.cloudinary.com/aias/image/upload/v1579367011/commonplace/barnsworthburning-airtable.png
[mockup]: https://res.cloudinary.com/aias/image/upload/v1579370056/commonplace/barnsworthburning-mockup.png
[byron]: https://barnsworthburning.net/extracts/recGKuN5ninWpmuwt
[fragments]: https://the-innocent-i.net/fragments/assemblages/
[sapper]: https://sapper.svelte.dev/
[murakami]: https://www.mrflamm.com/uploads/2/2/0/0/2200902/barnburningbyharukimurakami.pdf
[burning]: https://www.imdb.com/title/tt7282468/
[aptronym]: https://en.wikipedia.org/wiki/Aptronym