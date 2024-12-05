'use client' ;
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Users, LineChart, FileText, Package2, Package, HardDrive } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-light-green-100">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none">
                    Elevate Your Project Management
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Manage projects efficiently with our comprehensive tracking tools and integrations.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90">
                    Get Started
                  </Button>
                  <Button className="inline-flex h-10 items-center justify-center rounded-md border border-primary bg-white px-8 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-primary/20">
                    Learn More
                  </Button>
                </div>
              </div>
              <img
                src="https://picsum.photos/seed/picsum/200/300"
                width="550"
                height="550"
                alt="Project Management"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-bottom sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-light-green-200">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Core Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Our tool offers a range of features to streamline your project management process.
                </p>
              </div>
              <div className="grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                <Card className="flex flex-col items-center space-y-4 p-6">
                  <Package2 className="h-12 w-12" />
                  <div className="text-center">
                    <CardTitle className="text-lg font-bold">Project Creation</CardTitle>
                    <p className="text-muted-foreground">Admins can effortlessly create and manage projects.</p>
                  </div>
                </Card>
                <Card className="flex flex-col items-center space-y-4 p-6">
                  <FileText className="h-12 w-12" />
                  <div className="text-center">
                    <CardTitle className="text-lg font-bold">Detailed Timesheets</CardTitle>
                    <p className="text-muted-foreground">Generate comprehensive reports for team and project activities.</p>
                  </div>
                </Card>
                <Card className="flex flex-col items-center space-y-4 p-6">
                  <HardDrive className="h-12 w-12" />
                  <div className="text-center">
                    <CardTitle className="text-lg font-bold">Jira Integration</CardTitle>
                    <p className="text-muted-foreground">Seamlessly connect with Jira for better task management.</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Effortlessly track every aspect of your projects with our powerful tools.
                </p>
              </div>
              <Accordion type="single" collapsible className="w-full max-w-4xl mt-8">
                <AccordionItem value="project-creation">
                  <AccordionTrigger className="text-xl font-semibold">Project Creation</AccordionTrigger>
                  <AccordionContent>
                    Admins can create projects with predefined subtasks and codes, allowing for easy task tracking.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="timesheets">
                  <AccordionTrigger className="text-xl font-semibold">Generate Timesheets</AccordionTrigger>
                  <AccordionContent>
                    Generate detailed timesheets for teams and projects, helping you keep track of time spent efficiently.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="jira-integration">
                  <AccordionTrigger className="text-xl font-semibold">Jira Integration</AccordionTrigger>
                  <AccordionContent>
                    Integrate with Jira to manage tasks seamlessly across platforms.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-light-green-200">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Project Overview</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Get a snapshot of all ongoing projects and tasks.
                </p>
              </div>
              <Table className="w-full mt-8">
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Subtask</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Time Spent (hrs)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Project Alpha</TableCell>
                    <TableCell>Requirement Gathering</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-300">In Progress</Badge>
                    </TableCell>
                    <TableCell className="text-right">12</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Project Beta</TableCell>
                    <TableCell>UI Design</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-yellow-300">Pending</Badge>
                    </TableCell>
                    <TableCell className="text-right">5</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Project Gamma</TableCell>
                    <TableCell>Coding</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-300">Completed</Badge>
                    </TableCell>
                    <TableCell className="text-right">20</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-100 p-6 md:py-12">
        <div className="container flex justify-between text-sm">
          <div>
            <h3 className="font-semibold">Project Management Tool</h3>
            <p>Track and manage projects efficiently.</p>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline">Contact Us</Button>
            <Button variant="outline">Privacy Policy</Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;