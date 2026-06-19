require("dotenv/config");
const mongoose = require("mongoose");

const BlockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["heading", "paragraph", "code", "youtube", "link", "callout", "bullets", "divider"],
      required: true,
    },
    text: { type: String },
    level: { type: Number },
    code: { type: String },
    language: { type: String },
    url: { type: String },
    title: { type: String },
    description: { type: String },
    items: [{ type: String }],
    variant: { type: String },
  },
  { _id: false }
);

const TopicSchema = new mongoose.Schema(
  {
    track: { type: String, required: true, index: true },
    slug: { type: String, required: true },
    title: { type: String, required: true },
    summary: { type: String, default: "" },
    tags: [{ type: String }],
    order: { type: Number, default: 0 },
    blocks: { type: [BlockSchema], default: [] },
  },
  { timestamps: true }
);
TopicSchema.index({ track: 1, slug: 1 }, { unique: true });

const Topic = mongoose.models.Topic || mongoose.model("Topic", TopicSchema);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/abhishek-learns";

const lldTopics = [
  {
    track: "lld",
    slug: "solid-principles",
    title: "SOLID Principles",
    summary:
      "The five object-oriented design principles that make code easier to maintain, extend and test — a favourite in LLD interviews.",
    tags: ["oops", "solid", "fundamentals"],
    order: 0,
    blocks: [
      {
        type: "callout",
        variant: "info",
        text: "**SOLID** is an acronym for five design principles introduced by Robert C. Martin (Uncle Bob). Interviewers love asking you to *spot a violation* and refactor it.",
      },
      { type: "heading", level: 2, text: "The five principles" },
      {
        type: "bullets",
        items: [
          "S — Single Responsibility Principle",
          "O — Open/Closed Principle",
          "L — Liskov Substitution Principle",
          "I — Interface Segregation Principle",
          "D — Dependency Inversion Principle",
        ],
      },
      { type: "heading", level: 2, text: "1. Single Responsibility" },
      {
        type: "paragraph",
        text: "A class should have **only one reason to change**. Mixing persistence, business logic and formatting in one class makes it fragile.",
      },
      {
        type: "code",
        language: "cpp",
        code: "// Bad: Invoice does calculation AND printing AND saving\nclass Invoice {\npublic:\n    double calculateTotal();\n    void printInvoice();   // formatting responsibility\n    void saveToDb();       // persistence responsibility\n};\n\n// Good: split responsibilities\nclass Invoice { public: double calculateTotal(); };\nclass InvoicePrinter { public: void print(const Invoice& i); };\nclass InvoiceRepository { public: void save(const Invoice& i); };",
      },
      {
        type: "callout",
        variant: "tip",
        text: "Rule of thumb: if you describe a class using the word **\"and\"**, it probably has more than one responsibility.",
      },
      { type: "heading", level: 2, text: "2. Open/Closed" },
      {
        type: "paragraph",
        text: "Software entities should be **open for extension, but closed for modification**. Add new behaviour via new classes, not by editing tested code.",
      },
      {
        type: "code",
        language: "cpp",
        code: "class Shape { public: virtual double area() const = 0; };\nclass Circle : public Shape { double area() const override { return 3.14 * r * r; } double r; };\nclass Square : public Shape { double area() const override { return s * s; } double s; };\n\n// Adding a Triangle needs NO change to existing area logic.",
      },
      { type: "divider" },
      { type: "heading", level: 2, text: "Watch: SOLID in 8 minutes" },
      {
        type: "youtube",
        url: "https://www.youtube.com/watch?v=t8Vp_v_Ffa0",
        title: "SOLID Principles explained with examples",
      },
      { type: "heading", level: 3, text: "Further reading" },
      {
        type: "link",
        url: "https://en.wikipedia.org/wiki/SOLID",
        title: "SOLID — Wikipedia",
        description: "A concise reference for all five principles with examples.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Don't over-apply SOLID. Premature abstraction for a tiny program adds complexity without payoff.",
      },
    ],
  },
  {
    track: "lld",
    slug: "design-patterns-overview",
    title: "Design Patterns Overview",
    summary:
      "Creational, structural and behavioural patterns you should know cold for machine-coding rounds.",
    tags: ["design-patterns", "gof"],
    order: 1,
    blocks: [
      {
        type: "paragraph",
        text: "Design patterns are **reusable solutions to common problems**. The classic *Gang of Four* book groups them into three categories.",
      },
      { type: "heading", level: 2, text: "The three categories" },
      {
        type: "bullets",
        items: [
          "Creational — how objects are created (Singleton, Factory, Builder, Prototype)",
          "Structural — how objects are composed (Adapter, Decorator, Proxy, Facade)",
          "Behavioural — how objects interact (Observer, Strategy, State, Command)",
        ],
      },
      { type: "heading", level: 2, text: "Example: Strategy pattern" },
      {
        type: "paragraph",
        text: "Strategy lets you swap an algorithm at runtime — perfect when you have many `if/else` branches choosing behaviour.",
      },
      {
        type: "code",
        language: "cpp",
        code: "struct PaymentStrategy { virtual void pay(int amount) = 0; virtual ~PaymentStrategy() {} };\nstruct UpiPayment : PaymentStrategy { void pay(int a) override { /* ... */ } };\nstruct CardPayment : PaymentStrategy { void pay(int a) override { /* ... */ } };\n\nclass Checkout {\n    PaymentStrategy* strategy;\npublic:\n    void setStrategy(PaymentStrategy* s) { strategy = s; }\n    void checkout(int amount) { strategy->pay(amount); }\n};",
      },
      {
        type: "callout",
        variant: "tip",
        text: "In interviews, name the pattern **and** justify why it fits — interviewers care about the *reasoning*, not memorisation.",
      },
      { type: "divider" },
      {
        type: "link",
        url: "https://refactoring.guru/design-patterns",
        title: "Refactoring Guru — Design Patterns",
        description: "Beautifully illustrated catalogue of all GoF patterns.",
      },
    ],
  },
  {
    track: "lld",
    slug: "parking-lot-system",
    title: "Design a Parking Lot",
    summary:
      "A classic machine-coding problem. Walk through requirements, entities and a clean class design.",
    tags: ["machine-coding", "case-study"],
    order: 2,
    blocks: [
      {
        type: "callout",
        variant: "info",
        text: "This is one of the **most asked** LLD problems. Practise narrating your thought process out loud.",
      },
      { type: "heading", level: 2, text: "Requirements" },
      {
        type: "bullets",
        items: [
          "Multiple floors, each with many parking spots",
          "Spots support different vehicle sizes (bike, car, truck)",
          "Issue a ticket on entry, compute fee on exit",
          "Find the nearest available spot for a vehicle",
        ],
      },
      { type: "heading", level: 2, text: "Core entities" },
      {
        type: "code",
        language: "cpp",
        code: "enum class VehicleType { BIKE, CAR, TRUCK };\n\nclass Vehicle {\n    std::string number;\n    VehicleType type;\n};\n\nclass ParkingSpot {\n    int id;\n    VehicleType size;\n    bool occupied = false;\n    Vehicle* vehicle = nullptr;\n};\n\nclass Ticket {\n    std::string id;\n    long entryTime;\n    ParkingSpot* spot;\n};",
      },
      { type: "heading", level: 2, text: "Fee calculation" },
      {
        type: "paragraph",
        text: "Use a `Strategy` so pricing rules (hourly, day pass, weekend) can change without touching the core flow.",
      },
      {
        type: "callout",
        variant: "danger",
        text: "Common mistake: making `ParkingLot` a god-class that does spot allocation, ticketing **and** payment. Split them!",
      },
      { type: "divider" },
      { type: "heading", level: 3, text: "Video walkthrough" },
      {
        type: "youtube",
        url: "https://youtu.be/DSGsa0pu8-k",
        title: "Parking Lot low-level design",
      },
    ],
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  await Topic.deleteMany({ track: "lld" });
  console.log("Cleared existing LLD topics");

  await Topic.insertMany(lldTopics);
  console.log(`Seeded ${lldTopics.length} LLD topics with all block types.`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
