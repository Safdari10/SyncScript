// Quick test in your code
import prisma from "@/lib/db";

async function testDB() {
  await prisma.document.create({ data: { content: "Test" } });
  const docs = await prisma.document.findMany();
  console.log(docs);
  await prisma.$disconnect();
}

testDB().catch((e) => {
  console.error(e);
  process.exit(1);
});
