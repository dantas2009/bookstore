import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

    const genres = [];
    const genreList = getGenreList();
    const inventories = [];
    const books: any[] = []
    const bookList = getbookList();
    const booksgenres = [];

    //MOCK GENRES
    for (const genreName of genreList) {
        genres.push({
            genre: genreName.genre,
        });
    }

    await prisma.genres.createMany({
        data: genres
    });

    //MOCK BOOKS
    for (const book of bookList) {
        books.push({
            title: book.title,
            author: book.author,
            publisher: book.publisher,
            published: new Date(book.published).toISOString().split('T')[0] + 'T00:00:00Z',
            description: book.description,
            isbn: book.isbn,
            price: book.price,
            discount: book.discount,
            language: book.language,
            image: book.image,
        });
    }

    await prisma.books.createMany({
        data: books
    });

    //MOCK BOOKS_GENRES
    for (const book of bookList) {
        for (const genre of book.genres) {
            booksgenres.push({
                id_book: book.id,
                id_genre: genre,
            });
        }
    }

    await prisma.booksgenres.createMany({
        data: booksgenres
    });

    //MOCK INVENTORIES
    for (let id = 1; id <= books.length; id++) {
        inventories.push({
            id_book: id,
            quantity: 1000,
        });
    }

    await prisma.inventories.createMany({
        data: inventories
    });

}


main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

function getGenreList() {
    return [
        { id: 1, genre: "Dystopian" },
        { id: 2, genre: "Science" },
        { id: 3, genre: "Memoir" },
        { id: 4, genre: "Autobiography" },
        { id: 5, genre: "Fantasy" },
        { id: 6, genre: "Children's Literature" },
        { id: 7, genre: "Non-fiction" },
        { id: 8, genre: "Historical Fiction" },
        { id: 9, genre: "Classic Literature" },
        { id: 10, genre: "Biography" },
        { id: 11, genre: "Modern Classics" },
        { id: 12, genre: "Satire" },
        { id: 13, genre: "Adventure" },
        { id: 14, genre: "Inspirational" },
        { id: 15, genre: "Self-help" },
        { id: 16, genre: "Graphic Novel" },
        { id: 17, genre: "Science Fiction" },
        { id: 18, genre: "Psychological Fiction" },
        { id: 19, genre: "Crime Fiction" },
        { id: 20, genre: "Romance" },
        { id: 21, genre: "Post-apocalyptic" },
        { id: 22, genre: "Travel" },
        { id: 23, genre: "Children's Picture Book" },
        { id: 24, genre: "Historical" },
        { id: 25, genre: "Sociology" },
        { id: 26, genre: "Short Stories" },
        { id: 27, genre: "Absurdist Fiction" },
        { id: 28, genre: "Comics" },
        { id: 29, genre: "Cooking" },
        { id: 30, genre: "Family Saga" },
        { id: 31, genre: "Western" },
        { id: 32, genre: "Contemporary" },
        { id: 33, genre: "Mystery" },
        { id: 34, genre: "Philosophy" }
    ];
}

function getbookList() {

    const book1 = {
        id: 1,
        title: '1984',
        author: 'George Orwell',
        publisher: 'Signet Classic',
        published: '1961-01-01',
        description: `Written 75 years ago, 1984 was George Orwell's chilling prophecy about the future. And while 1984 has come and gone, his dystopian vision of a government that will do anything to control the narrative is timelier than ever...`,
        isbn: '9780451524935',
        price: 9.99,
        discount: 2.79,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/71rpa1-kyvL._SL500_.jpg',
        genres: [1, 9, 17]
    }

    const book2 = {
        id: 2,
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        publisher: 'Random House Publishing Group',
        published: '1998-09-01',
        description: `A landmark volume in science writing by one of the great minds of our time, Stephen Hawking's book explores such profound questions as: How did the universe begin—and what made its start possible? Does time always flow forward? Is the universe unending—or are there boundaries? Are there other dimensions in space? What will happen when it all ends?
    
    Told in language we all can understand, A Brief History of Time plunges into the exotic realms of black holes and quarks, of antimatter and “arrows of time,” of the big bang and a bigger God—where the possibilities are wondrous and unexpected. With exciting images and profound imagination, Stephen Hawking brings us closer to the ultimate secrets at the very heart of creation.`,
        isbn: '9780553380163',
        price: 18,
        discount: 8.1,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/51X2RycvYSL._SL500_.jpg',
        genres: [2, 7]
    }

    const book3 = {
        id: 3,
        title: 'A Heartbreaking Work of Staggering Genius',
        author: 'Dave Eggers',
        publisher: 'Vintage',
        published: '2001-02-13',
        description: 'A Heartbreaking Work of Staggering Genius is the moving memoir of a college senior who, in the space of five weeks, loses both of his parents to cancer and inherits his eight-year-old brother. This exhilarating debut that manages to be simultaneously hilarious and wildly inventive as well as a deeply heartfelt story of the love that holds a family together.',
        isbn: '9780375725784',
        price: 19,
        discount: 7.98,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/41ja6Scd0qL._SL500_.jpg',
        genres: [3, 4]
    }

    const book4 = {
        id: 4,
        title: 'Long Way Gone',
        author: 'Ishmael Beah',
        publisher: 'Sarah Crichton Books',
        published: '2008-08-05',
        description: 'In A Long Way Gone, Beah, now twenty-five years old, tells a riveting story: how at the age of twelve, he fled attacking rebels and wandered a land rendered unrecognizable by violence. By thirteen, he\'d been picked up by the government army, and Beah, at heart a gentle boy, found that he was capable of truly terrible acts. This is a rare and mesmerizing account, told with real literary force and heartbreaking honesty.',
        isbn: '9780374531263',
        price: 16,
        discount: 8.16,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/71ikTHqw2uL._SL500_.jpg',
        genres: [3, 4]
    }

    const book5 = {
        id: 5,
        title: 'The Bad Beginning: Or, Orphans!',
        author: 'Lemony Snicket',
        publisher: 'HarperCollins',
        published: '2007-05-08',
        description: 'Are you made fainthearted by death? Does fire unnerve you? Is a villain something that might crop up in future nightmares of yours? Are you thrilled by nefarious plots? Is cold porridge upsetting to you? Vicious threats? Hooks? Uncomfortable clothing?\n\nIt is likely that your answers will reveal A Series of Unfortunate Events to be ill-suited for your personal use. A librarian, bookseller, or acquaintance should be able to suggest books more appropriate for your fragile temperament. But to the rarest of readers we say, "Proceed, but cautiously."',
        isbn: '0061146307',
        price: 9.99,
        discount: 2.19,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/91My81zRcaL._SL500_.jpg',
        genres: [5, 6]
    }

    const book6 = {
        id: 6,
        title: 'Alice\'s Adventures in Wonderland & Through the Looking-Glass',
        author: 'Lewis Carroll',
        publisher: 'Bantam Classics',
        published: '1984-06-01',
        description: `In 1862 Charles Lutwidge Dodgson, a shy Oxford mathematician with a stammer, created a story about a little girl tumbling down a rabbit hole. Thus began the immortal adventures of Alice, perhaps the most popular heroine in English literature.

Countless scholars have tried to define the charm of the Alice books—with those wonderfully eccentric characters the Queen of Hearts, Tweedledum, and Tweedledee, the Cheshire Cat, Mock Turtle, the Mad Hatter et al.—by proclaiming that they really comprise a satire on language, a political allegory, a parody of Victorian children’s literature, even a reflection of contemporary ecclesiastical history.

Perhaps, as Dodgson might have said, Alice is no more than a dream, a fairy tale about the trials and tribulations of growing up—or down, or all turned round—as seen through the expert eyes of a child.`,
        isbn: '9780553213454',
        price: 5.95,
        discount: 0,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/718uM3e1BNL._SL500_.jpg',
        genres: [5, 6, 27]
    }

    const book7 = {
        id: 7,
        title: `All the President's Men`,
        author: 'Bob Woodward, Carl Bernstein',
        publisher: 'Simon & Schuster',
        published: '1994-06-16',
        description: `The full account of the Watergate scandal from the two Washington Post reporters who broke the story. This is “the work that brought down a presidency…perhaps the most influential piece of journalism in history” (Time, All-Time 100 Best Nonfiction Books).

This is the book that changed America. Published just two months before President Nixon's resignation, All the President's Men revealed the full scope of the Watergate scandal and introduced for the first time the mysterious “Deep Throat.” Beginning with the story of a simple burglary at Democratic headquarters and then continuing through headline after headline, Bernstein and Woodward deliver the stunning revelations and pieces in the Watergate puzzle that brought about Nixon's shocking downfall. Their explosive reports won a Pulitzer Prize for The Washington Post, toppled the president, and have since inspired generations of reporters.

All the President's Men is a riveting detective story, capturing the exhilarating rush of the biggest presidential scandal in U.S. history as it unfolded in real time. It is, as former New York Times managing editor Gene Roberts has called it, “maybe the single greatest reporting effort of all time.”`,
        isbn: '0671894412',
        price: 16,
        discount: 6.05,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/61lSD6cxtOL._SL500_.jpg',
        genres: [7, 20]
    }

    const book8 = {
        id: 8,
        title: `Angela's Ashes: A Memoir`,
        author: 'Frank McCourt',
        publisher: 'Scribner',
        published: '1999-05-25',
        description: `A Pulitzer Prize-winning, #1 New York Times bestseller, Angela's Ashes is Frank McCourt's masterful memoir of his childhood in Ireland.

“When I look back on my childhood I wonder how I managed to survive at all. It was, of course, a miserable childhood: the happy childhood is hardly worth your while. Worse than the ordinary miserable childhood is the miserable Irish childhood, and worse yet is the miserable Irish Catholic childhood.”

So begins the luminous memoir of Frank McCourt, born in Depression-era Brooklyn to recent Irish immigrants and raised in the slums of Limerick, Ireland. Frank's mother, Angela, has no money to feed the children since Frank's father, Malachy, rarely works, and when he does he drinks his wages. Yet Malachy—exasperating, irresponsible, and beguiling—does nurture in Frank an appetite for the one thing he can provide: a story. Frank lives for his father's tales of Cuchulain, who saved Ireland, and of the Angel on the Seventh Step, who brings his mother babies.
`,
        isbn: '068484267X',
        price: 19,
        discount: 7.66,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/8163gXL453L._SL500_.jpg',
        genres: [3, 8]
    }

    const book9 = {
        id: 9,
        title: 'Beloved',
        author: 'Toni Morrison',
        publisher: 'Vintage',
        published: '2004-06-08',
        description: `Sethe was born a slave and escaped to Ohio, but eighteen years later she is still not free. Sethe has too many memories of Sweet Home, the beautiful farm where so many hideous things happened. And Sethe's new home is haunted by the ghost of her baby, who died nameless and whose tombstone is engraved with a single word: Beloved. `,
        isbn: '1400033411',
        price: 17,
        discount: 6.99,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/51Qj9kPD4CL._SL500_.jpg',
        genres: [8, 9]
    }

    const book10 = {
        id: 10,
        title: 'Born to Run',
        author: 'Christopher McDougall',
        publisher: 'Vintage',
        published: '2011-03-29',
        description: `Isolated by Mexico's deadly Copper Canyons, the blissful Tarahumara Indians have honed the ability to run hundreds of miles without rest or injury. In a riveting narrative, award-winning journalist and often-injured runner Christopher McDougall sets out to discover their secrets. In the process, he takes his readers from science labs at Harvard to the sun-baked valleys and freezing peaks across North America, where ever-growing numbers of ultra-runners are pushing their bodies to the limit, and, finally, to a climactic race in the Copper Canyons that pits America’s best ultra-runners against the tribe. McDougall’s incredible story will not only engage your mind but inspire your body when you realize that you, indeed all of us, were born to run.`,
        isbn: '0307279189',
        price: 19,
        discount: 8.5,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/81BAIsimy6L._SL500_.jpg',
        genres: [4, 10]
    }

    const book11 = {
        id: 11,
        title: 'Breath, Eyes, Memory',
        author: 'Edwidge Danticat',
        publisher: 'Vintage',
        published: '1998-05-31',
        description: `At an astonishingly young age, Edwidge Danticat has become one of our most celebrated new novelists, a writer who evokes the wonder, terror, and heartache of her native Haiti--and the enduring strength of Haiti's women--with a vibrant imagery and narrative grace that bear witness to her people's suffering and courage.  

At the age of twelve, Sophie Caco is sent from her impoverished village of Croix-des-Rosets to New York, to be reunited with a mother she barely remembers. There she discovers secrets that no child should ever know, and a legacy of shame that can be healed only when she returns to Haiti--to the women who first reared her. What ensues is a passionate journey through a landscape charged with the supernatural and scarred by political violence, in a novel that bears witness to the traditions, suffering, and wisdom of an entire people.`,
        isbn: '037570504X',
        price: 15,
        discount: 3,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/714EE6km5nL._SL500_.jpg',
        genres: [11, 8]
    }

    const book12 = {
        id: 12,
        title: 'Catch-22',
        author: 'Joseph Heller',
        publisher: 'Simon & Schuster',
        published: '2011-04-05',
        description: `Fifty years after its original publication, Catch-22 remains a cornerstone of American literature and one of the funniest—and most celebrated—books of all time. In recent years it has been named to “best novels” lists by Time, Newsweek, the Modern Library, and the London Observer.

Set in Italy during World War II, this is the story of the incomparable, malingering bombardier, Yossarian, a hero who is furious because thousands of people he has never met are trying to kill him. But his real problem is not the enemy—it is his own army, which keeps increasing the number of missions the men must fly to complete their service. Yet if Yossarian makes any attempt to excuse himself from the perilous missions he's assigned, he'll be in violation of Catch-22, a hilariously sinister bureaucratic rule: a man is considered insane if he willingly continues to fly dangerous combat missions, but if he makes a formal request to be removed from duty, he is proven sane and therefore ineligible to be relieved.

This fiftieth-anniversary edition commemorates Joseph Heller's masterpiece with a new introduction by Christopher Buckley; a wealth of critical essays and reviews by Norman Mailer, Alfred Kazin, Anthony Burgess, and others; rare papers and photos from Joseph Heller's personal archive; and much more. Here, at last, is the definitive edition of a classic of world literature.`,
        isbn: '1451626657',
        price: 19.99,
        discount: 9.11,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/71Ym0vDDWsL._SL500_.jpg',
        genres: [12, 9, 27]
    }

    const book13 = {
        id: 13,
        title: 'Charlie and the Chocolate Factory',
        author: 'Roald Dahl',
        publisher: 'Puffin Books',
        published: '2004-04-12',
        description: `Willy Wonka's famous chocolate factory is opening at last!

But only five lucky children will be allowed inside. And the winners are: Augustus Gloop, an enormously fat boy whose hobby is eating; Veruca Salt, a spoiled-rotten brat whose parents are wrapped around her little finger; Violet Beauregarde, a dim-witted gum-chewer with the fastest jaws around; Mike Teavee, a toy pistol-toting gangster-in-training who is obsessed with television; and Charlie Bucket, Our Hero, a boy who is honest and kind, brave and true, and good and ready for the wildest time of his life!`,
        isbn: '0142401080',
        price: 8.99,
        discount: 0,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/51cIsgaYsOL._SL500_.jpg',
        genres: [5, 6, 13]
    }

    const book14 = {
        id: 14,
        title: `Charlotte's Web`,
        author: 'E. B. White',
        publisher: 'HarperCollins',
        published: '2012-04-10',
        description: `Some Pig. Humble. Radiant. These are the words in Charlotte's Web, high up in Zuckerman's barn. Charlotte's spiderweb tells of her feelings for a little pig named Wilbur, who simply wants a friend. They also express the love of a girl named Fern, who saved Wilbur's life when he was born the runt of his litter.

E. B. White's Newbery Honor Book is a tender novel of friendship, love, life, and death that will continue to be enjoyed by generations to come. It contains illustrations by Garth Williams, the acclaimed illustrator of E. B. White's Stuart Little and Laura Ingalls Wilder's Little House series, among many other books.`,
        isbn: '0061124958',
        price: 12.99,
        discount: 5,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/51V3q8yXZLL._SL500_.jpg',
        genres: [6, 13]
    }

    const book15 = {
        id: 15,
        title: 'Cutting for Stone',
        author: 'Abraham Verghese',
        publisher: 'Vintage',
        published: '2010-01-26',
        description: `Marion and Shiva Stone are twin brothers born of a secret union between a beautiful Indian nun and a brash British surgeon. Orphaned by their mother's death and their father's disappearance, bound together by a preternatural connection and a shared fascination with medicine, the twins come of age as Ethiopia hovers on the brink of revolution.

Moving from Addis Ababa to New York City and back again, Cutting for Stone is an unforgettable story of love and betrayal, medicine and ordinary miracles—and two brothers whose fates are forever intertwined.`,
        isbn: '9780375714368',
        price: 19,
        discount: 9.06,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/81Gh8Izw4xL._SL500_.jpg',
        genres: [8, 30]
    }

    const book16 = {
        id: 16,
        title: 'Daring Greatly',
        author: 'Brené Brown',
        publisher: 'Avery',
        published: '2012-09-11',
        description: `Every day we experience the uncertainty, risks, and emotional exposure that define what it means to be vulnerable or to dare greatly. Based on twelve years of pioneering research, Brené Brown PhD, MSW, dispels the cultural myth that vulnerability is weakness and argues that it is, in truth, our most accurate measure of courage.

Brown explains how vulnerability is both the core of difficult emotions like fear, grief, and disappointment, and the birthplace of love, belonging, joy, empathy, innovation, and creativity. She writes: “When we shut ourselves off from vulnerability, we distance ourselves from the experiences that bring purpose and meaning to our lives.”

Daring Greatly is not about winning or losing. It's about courage. In a world where “never enough” dominates and feeling afraid has become second nature, vulnerability is subversive. Uncomfortable. It's even a little dangerous at times. And, without question, putting ourselves out there means there's a far greater risk of getting criticized or feeling hurt. But when we step back and examine our lives, we will find that nothing is as uncomfortable, dangerous, and hurtful as standing on the outside of our lives looking in and wondering what it would be like if we had the courage to step into the arena—whether it's a new relationship, an important meeting, the creative process, or a difficult family conversation. Daring Greatly is a practice and a powerful new vision for letting ourselves be seen.`,
        isbn: '1592407331',
        price: 28,
        discount: 13.81,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/81nzEXzPmWL._SL500_.jpg',
        genres: [14, 15]
    }


    const book17 = {
        id: 17,
        title: 'Diary of a Wimpy Kid, Book 1',
        author: 'Jeff Kinney',
        publisher: 'Amulet Books',
        published: '2007-04-01',
        description: `Being a kid can really stink. And no one knows this better than Greg. He finds himself thrust into middle school, where undersized weaklings share the hallways with kids who are taller, meaner, and already shaving. Greg is happy to have Rowley Jefferson, his sidekick, along for the ride. But when Rowley's star starts to rise, Greg tries to use his best friend's newfound popularity to his own advantage, kicking off a chain of events that will test their friendship in hilarious fashion.

The hazards of growing up before you're ready are uniquely revealed through words and drawings as Greg records them in his diary. But as Greg says: “Just don't expect me to be all “Dear Diary” this and “Dear Diary” that.”

Luckily for us, what Greg Heffley says he won't do and what he actually does are two very different things.`,
        isbn: '1419741853',
        price: 14.99,
        discount: 3.36,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/91XUENePBlL._SL500_.jpg',
        genres: [6, 16]
    }

    const book18 = {
        id: 18,
        title: 'Dune',
        author: 'Frank Herbert',
        publisher: 'Ace',
        published: '2005-08-02',
        description: `For more than seventy years, Penguin has been the leading publisher of classic literature in the English-speaking world. With more than 1,700 titles, Penguin Classics represents a global bookshelf of the best works throughout history and across genres and disciplines. Readers trust the series to provide authoritative texts enhanced by introductions and notes by distinguished scholars and contemporary authors, as well as up-to-date translations by award-winning translators.`,
        isbn: '9780143111580',
        price: 32,
        discount: 13.26,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/612WNEVw2RL._SL500_.jpg',
        genres: [5, 17]
    }

    const book19 = {
        id: 19,
        title: 'Fahrenheit 451',
        author: 'Ray Bradbury',
        publisher: 'Simon & Schuster',
        published: '2012-01-10',
        description: `Guy Montag is a fireman. His job is to destroy the most illegal of commodities, the printed book, along with the houses in which they are hidden. Montag never questions the destruction and ruin his actions produce, returning each day to his bland life and wife, Mildred, who spends all day with her television “family.” But when he meets an eccentric young neighbor, Clarisse, who introduces him to a past where people didn’t live in fear and to a present where one sees the world through the ideas in books instead of the mindless chatter of television, Montag begins to question everything he has ever known.`,
        isbn: '9781451673319',
        price: 17,
        discount: 8.64,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/61z7RDG3OIL._SL500_.jpg',
        genres: [1, 17, 21]
    }

    const book20 = {
        id: 20,
        title: 'Fear and Loathing in Las Vegas',
        author: 'Hunter S. Thompson',
        publisher: 'Vintage',
        published: '1998-05-12',
        description: `This cult classic of gonzo journalism is the best chronicle of drug-soaked, addle-brained, rollicking good times ever committed to the printed page.  It is also the tale of a long weekend road trip that has gone down in the annals of American pop culture as one of the strangest journeys ever undertaken.`,
        isbn: '9780679785897',
        price: 17,
        discount: 6.51,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/81E8GG6W29L._SL500_.jpg',
        genres: [7, 22]
    }

    const book21 = {
        id: 21,
        title: 'Gone Girl',
        author: 'Gillian Flynn',
        publisher: 'Random House',
        published: '2014-04-22',
        description: `On a warm summer morning in North Carthage, Missouri, it is Nick and Amy Dunne's fifth wedding anniversary. Presents are being wrapped and reservations are being made when Nick's clever and beautiful wife disappears. Husband-of-the-Year Nick isn't doing himself any favors with cringe-worthy daydreams about the slope and shape of his wife's head, but passages from Amy's diary reveal the alpha-girl perfectionist could have put anyone dangerously on edge. Under mounting pressure from the police and the media—as well as Amy's fiercely doting parents—the town golden boy parades an endless series of lies, deceits, and inappropriate behavior. Nick is oddly evasive, and he's definitely bitter—but is he really a killer? `,
        isbn: '0307588378',
        price: 28,
        discount: 16.05,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/51yPqOEB0FL._SL500_.jpg',
        genres: [18, 33]
    }

    const book22 = {
        id: 22,
        title: 'Goodnight Moon',
        author: 'Margaret Wise Brown',
        publisher: 'HarperCollins',
        published: '2007-01-23',
        description: `In a great green room, tucked away in bed, is a little bunny. "Goodnight room, goodnight moon." And to all the familiar things in the softly lit room—to the picture of the three little bears sitting on chairs, to the clocks and his socks, to the mittens and the kittens, to everything one by one—the little bunny says goodnight.

One of the most beloved books of all time, Goodnight Moon is a must for every bookshelf and a time-honored gift for baby showers and other special events.`,
        isbn: '0060775858',
        price: 21.99,
        discount: 7.6,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/81E6tmYOD7L._SL500_.jpg',
        genres: [23, 6]
    }

    const book23 = {
        id: 23,
        title: 'Great Expectations',
        author: 'Charles Dickens',
        publisher: 'Penguin Classics',
        published: '2001-08-01',
        description: `In this unflaggingly suspenseful story of aspirations and moral redemption, humble, orphaned Pip, a ward of his short-tempered older sister and her husband, Joe, is apprenticed to the dirty work of the forge but dares to dream of becoming a gentleman. And, indeed, it seems as though that dream is destined to come to pass — because one day, under sudden and enigmatic circumstances, he finds himself in possession of "great expectations." In telling Pip's story, Dickens traces a boy's path from a hardscrabble rural life to the teeming streets of 19th-century London, unfolding a gripping tale of crime and guilt, revenge and reward, and love and loss. Its compelling characters include Magwitch, the fearful and fearsome convict; Estella, whose beauty is excelled only by her haughtiness; and the embittered Miss Havisham, an eccentric jilted bride.
Written in the last decade of Dickens' life, Great Expectations was praised widely and universally admired. It was his last great novel, and many critics believe it to be his finest. Readers and critics alike praised it for its masterful plot, which rises above the melodrama of some of his earlier works, and for its three-dimensional, psychologically realistic characters — characters much deeper and more interesting than the one-note caricatures of earlier novels. "In none of his other works," wrote the reviewer in the 1861 Atlantic, "does he evince a shrewder insight into real life, and a cheaper perception and knowledge of what is called the world." To Swinburne, the novel was unparalleled in all of English fiction, with defects "as nearly imperceptible as spots on the sun or shadows on a sunlit sea." Shaw found it Dickens' "most completely perfect book." Now this inexpensive edition invites modern readers to savor this timeless masterpiece, teeming with colorful characters, unexpected plot twists, and Dickens' vivid rendering of the vast tapestry of mid-Victorian England.`,
        isbn: '9780486415864',
        price: 8,
        discount: 2.51,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/91B16mv1ZyL._SL500_.jpg',
        genres: [9, 24]
    }

    const book24 = {
        id: 24,
        title: 'Guns, Germs, and Steel',
        author: 'Jared Diamond',
        publisher: 'W. W. Norton & Company',
        published: '2005-06-17',
        description: `Winner of the Pulitzer Prize, Guns, Germs, and Steel is a brilliant work answering the question of why the peoples of certain continents succeeded in invading other continents and conquering or displacing their peoples. This edition includes a new chapter on Japan and all-new illustrations drawn from the television series. Until around 11,000 BC, all peoples were still Stone Age hunter/gatherers. At that point, a great divide occurred in the rates that human societies evolved. In Eurasia, parts of the Americas, and Africa, farming became the prevailing mode of existence when indigenous wild plants and animals were domesticated by prehistoric planters and herders. As Jared Diamond vividly reveals, the very people who gained a head start in producing food would collide with preliterate cultures, shaping the modern world through conquest, displacement, and genocide.The paths that lead from scattered centers of food to broad bands of settlement had a great deal to do with climate and geography. But how did differences in societies arise? Why weren't native Australians, Americans, or Africans the ones to colonize Europe? Diamond dismantles pernicious racial theories tracing societal differences to biological differences. He assembles convincing evidence linking germs to domestication of animals, germs that Eurasians then spread in epidemic proportions in their voyages of discovery. In its sweep, Guns, Germs and Steel encompasses the rise of agriculture, technology, writing, government, and religion, providing a unifying theory of human history as intriguing as the histories of dinosaurs and glaciers. 32 illustrations`,
        isbn: '0393317552',
        price: 29.95,
        discount: 6.42,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/61eZREdzp9L._SL500_.jpg',
        genres: [7, 25]
    }

    const book25 = {
        id: 25,
        title: 'In Cold Blood',
        author: 'Truman Capote',
        publisher: 'Vintage',
        published: '2013-02-19',
        description: `Truman Capote's masterpiece, In Cold Blood, created a sensation when it was first published, serially, in The New Yorker in 1965. The intensively researched, atmospheric narrative of the lives of the Clutter family of Holcomb, Kansas, and of the two men, Richard Eugene Hickock and Perry Edward Smith, who brutally killed them on the night of November 15, 1959, is the seminal work of the “new journalism.” Perry Smith is one of the great dark characters of American literature, full of contradictory emotions. “I thought he was a very nice gentleman,” he says of Herb Clutter. “Soft-spoken. I thought so right up to the moment I cut his throat.” Told in chapters that alternate between the Clutter household and the approach of Smith and Hickock in their black Chevrolet, then between the investigation of the case and the killers' flight, Capote's account is so detailed that the reader comes to feel almost like a participant in the events.`,
        isbn: '0812994388',
        price: 25,
        discount: 8.51,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/61J-vlfHL4L._SL500_.jpg',
        genres: [18, 19]
    }

    const book26 = {
        id: 26,
        title: 'Interpreter of Maladies',
        author: 'Jhumpa Lahiri',
        publisher: 'Mariner Books',
        published: '1999-06-01',
        description: `Winner of the Pulitzer Prize for fiction, this stunning debut collection unerring charts the emotional journeys of characters seeking love beyond the barriers of nations and generations. In stories that travel from India to America and back again, Lahiri speaks with universal eloquence to everyone who has ever felt like a foreigner.`,
        isbn: '039592720X',
        price: 14.95,
        discount: 0.96,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/81fJiVNmx6L._SL500_.jpg',
        genres: [8, 26]
    }

    const book27 = {
        id: 27,
        title: 'Invisible Man',
        author: 'Ralph Ellison',
        publisher: 'Vintage',
        published: '1994-06-14',
        description: `Invisible Man is a milestone in American literature, a book that has continued to engage readers since its appearance in 1952. A first novel by an unknown writer, it remained on the bestseller list for sixteen weeks, won the National Book Award for fiction, and established Ralph Ellison as one of the key writers of the century. The nameless narrator of the novel describes growing up in a black community in the South, attending a Negro college from which he is expelled, moving to New York and becoming the chief spokesman of the Harlem branch of "the Brotherhood," and retreating amid violence and confusion to the basement lair of the Invisible Man he imagines himself to be. The book is a passionate and witty tour de force of style, strongly influenced by T.S. Eliot's The Waste Land, Joyce, and Dostoevsky.`,
        isbn: '9780679601395',
        price: 24,
        discount: 7.01,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/51KqxY9rsnL._SL500_.jpg',
        genres: [9, 27]
    }

    const book28 = {
        id: 28,
        title: 'Jimmy Corrigan: The Smartest Kid on Earth',
        author: 'Chris Ware',
        publisher: 'Pantheon',
        published: '2000-09-12',
        description: `An improvisatory romance which gingerly deports itself between 1890's Chicago and 1980's small town Michigan, the reader is helped along by thousands of colored illustrations and diagrams, which, when read rapidly in sequence, provide a convincing illusion of life and movement. The bulk of the work is supported by fold-out instructions, an index, paper cut-outs, and a brief apology, all of which concrete to form a rich portrait of a man stunted by a paralyzing fear of being disliked.`,
        isbn: '0375404538',
        price: 35,
        discount: 10.51,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/71Sw4y4JdYL._SL500_.jpg',
        genres: [16, 27]
    }

    const book29 = {
        id: 29,
        title: 'Kitchen Confidential',
        author: 'Anthony Bourdain',
        publisher: 'Ecco',
        published: '2007-01-09',
        description: `Almost two decades ago, the New Yorker published a now infamous article, “Don't Eat before You Read This,” by then little-known chef Anthony Bourdain. Bourdain spared no one's appetite as he revealed what happens behind the kitchen door. The article was a sensation, and the book it spawned, the now classic Kitchen Confidential, became an even bigger sensation, a megabestseller with over one million copies in print. Frankly confessional, addictively acerbic, and utterly unsparing, Bourdain pulls no punches in this memoir of his years in the restaurant business.

Fans will love to return to this deliciously funny, delectably shocking banquet of wild-but-true tales of life in the culinary trade from Chef Anthony Bourdain, laying out his more than a quarter-century of drugs, sex, and haute cuisine—this time with never-before-published material.`,
        isbn: '0060899220',
        price: 18.99,
        discount: 9.6,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/61x2L0qJhFL._SL500_.jpg',
        genres: [29, 4]
    }

    const book30 = {
        id: 30,
        title: 'Life After Life',
        author: 'Kate Atkinson',
        publisher: 'Back Bay Books',
        published: '2014-01-07',
        description: `What if you could live again and again, until you got it right?

On a cold and snowy night in 1910, Ursula Todd is born to an English banker and his wife. She dies before she can draw her first breath. On that same cold and snowy night, Ursula Todd is born, lets out a lusty wail, and embarks upon a life that will be, to say the least, unusual. For as she grows, she also dies, repeatedly, in a variety of ways, while the young century marches on towards its second cataclysmic world war.

Does Ursula's apparently infinite number of lives give her the power to save the world from its inevitable destiny? And if she can -- will she?`,
        isbn: '0316176486',
        price: 19.99,
        discount: 8.2,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/91vC1XTgpXL._SL500_.jpg',
        genres: [30, 32]
    }

    const book31 = {
        id: 31,
        title: 'Little House on the Prairie',
        author: 'Laura Ingalls Wilder',
        publisher: 'HarperCollins',
        published: '2010-09-28',
        description: `Laura Ingalls and her family are heading to Kansas! Leaving behind their home in the Big Woods of Wisconsin, they travel by covered wagon until they find the perfect spot to build a little house on the prairie. Laura and her sister Mary love exploring the rolling hills around their new home, but the family must soon get to work, farming and hunting and gathering food for themselves and for their livestock. Just when the Ingalls family starts to settle into their new home, they find themselves caught in the middle of a conflict. Will they have to move again?

The nine books in the timeless Little House series tell the story of Laura's real childhood as an American pioneer, and are cherished by readers of all generations. They offer a unique glimpse into life on the American frontier, and tell the heartwarming, unforgettable story of a loving family.`,
        isbn: '0061958271',
        price: 16.99,
        discount: 9.24,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/81w86YvJBxL._SL500_.jpg',
        genres: [13, 31]
    }

    const book32 = {
        id: 32,
        title: 'Lolita',
        author: 'Vladimir Nabokov',
        publisher: `Everyman's Library`,
        published: '1993-03-09',
        description: `When it was published in 1955, Lolita immediately became a cause célèbre because of the freedom and sophistication with which it handled the unusual erotic predilections of its protagonist. Awe and exhilaration-along with heartbreak and mordant wit-abound in this account of the aging Humbert Humbert's obsessive, devouring, and doomed passion for the nymphet Dolores Haze.
Lolita is also the story of a hypercivilized European colliding with the cheerful barbarism of postwar America, but most of all, it is a meditation on love-love as outrage and hallucination, madness and transformation.

Everyman's Library pursues the highest production standards, printing on acid-free cream-colored paper, with full-cloth cases with two-color foil stamping, decorative endpapers, silk ribbon markers, European-style half-round spines, and a full-color illustrated jacket. Contemporary Classics include an introduction, a select bibliography, and a chronology of the author's life and times.`,
        isbn: '0679410430',
        price: 28,
        discount: 5.53,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/71p2s1DYD5L._SL500_.jpg',
        genres: [9, 32]
    }

    const book33 = {
        id: 33,
        title: 'Love in the Time of Cholera',
        author: 'Gabriel García Márquez',
        publisher: 'Vintage',
        published: '2007-10-05',
        description: `In their youth, Florentino Ariza and Fermina Daza fall passionately in love. When Fermina eventually chooses to marry a wealthy, well-born doctor, Florentino is devastated, but he is a romantic. As he rises in his business career he whiles away the years in 622 affairs--yet he reserves his heart for Fermina. Her husband dies at last, and Florentino purposefully attends the funeral. Fifty years, nine months, and four days after he first declared his love for Fermina, he will do so again.`,
        isbn: '0307389731',
        price: 17,
        discount: 7.34,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/61OBwknuKsL._SL500_.jpg',
        genres: [20, 8]
    }

    const book34 = {
        id: 34,
        title: 'Love Medicine',
        author: 'Louise Erdrich',
        publisher: 'Harper Perennial',
        published: '2009-05-05',
        description: `The stunning first novel in Louise Erdrich's Native American series, Love Medicine tells the story of two families, the Kashpaws and the Lamartines. Written in Erdrich's uniquely poetic, powerful style, it is a multi-generational portrait of strong men and women caught in an unforgettable drama of anger, desire, and the healing power that is love medicine.`,
        isbn: '9780061787423',
        price: 16.99,
        discount: 9.5,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/71rLMoG5G-L._SL500_.jpg',
        genres: [8, 30]
    }

    const book35 = {
        id: 35,
        title: `Man's Search for Meaning`,
        author: 'Viktor E. Frankl',
        publisher: 'Beacon Press',
        published: '2006-06-01',
        description: `This seminal book, which has been called “one of the outstanding contributions to psychological thought” by Carl Rogers and “one of the great books of our time” by Harold Kushner, has been translated into more than fifty languages and sold over sixteen million copies. “An enduring work of survival literature,” according to the New York Times, Viktor Frankl's riveting account of his time in the Nazi concentration camps, and his insightful exploration of the human will to find meaning in spite of the worst adversity, has offered solace and guidance to generations of readers since it was first published in 1946. At the heart of Frankl's theory of logotherapy (from the Greek word for “meaning”) is a conviction that the primary human drive is not pleasure, as Freud maintained, but rather the discovery and pursuit of what the individual finds meaningful. Today, as new generations face new challenges and an ever more complex and uncertain world, Frankl's classic work continues to inspire us all to find significance in the very act of living, in spite of all obstacles.`,
        isbn: '9780807014295',
        price: 16,
        discount: 4.51,
        language: 'English',
        image: 'https://m.media-amazon.com/images/I/91x-lhVENfL._SL500_.jpg',
        genres: [34, 4]
    }

    return [book1, book2, book3, book4, book5, book6, book7, book8, book9, book10, book11, book12, book13, book14, book15, book16, book17, book18, book19, book20, book21, book22, book23, book24, book25, book26, book27, book28, book29, book30, book31, book32, book33, book34, book35];

}