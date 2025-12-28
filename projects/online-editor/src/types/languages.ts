export type SupportedLanguage = 'python' | 'javascript' | 'typescript' | 'html' | 'css' | 'json' | 'java' | 'cpp' | 'c' | 'csharp' | 'php' | 'ruby' | 'go' | 'rust' | 'kotlin' | 'swift';

export interface LanguageConfig {
  id: SupportedLanguage;
  name: string;
  monacoLanguage: string;
  defaultCode: string;
  fileExtension: string;
  icon: string;
  supportsExecution: boolean;
}

export const LANGUAGE_CONFIGS: Record<SupportedLanguage, LanguageConfig> = {
  python: {
    id: 'python',
    name: 'Python',
    monacoLanguage: 'python',
    fileExtension: 'py',
    icon: '🐍',
    supportsExecution: true,
    defaultCode: `# Welcome to Python Playground
print("Hello, World!")

# Try some basic operations
numbers = [1, 2, 3, 4, 5]
squared = [x**2 for x in numbers]
print("Numbers: " + str(numbers))
print("Squared: " + str(squared))

# Calculate sum and average
total = sum(numbers)
average = total / len(numbers)
print("Sum: " + str(total))
print("Average: " + str(average))
`
  },
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    monacoLanguage: 'javascript',
    fileExtension: 'js',
    icon: '🟨',
    supportsExecution: true,
    defaultCode: `// Welcome to JavaScript Playground
console.log("Hello, World!");

// Try some basic operations
const numbers = [1, 2, 3, 4, 5];
const squared = numbers.map(x => x ** 2);
console.log("Numbers:", numbers);
console.log("Squared:", squared);

// Modern JavaScript features
const greet = (name = "World") => "Hello, " + name + "!";
console.log(greet("JavaScript"));
`
  },
  typescript: {
    id: 'typescript',
    name: 'TypeScript',
    monacoLanguage: 'typescript',
    fileExtension: 'ts',
    icon: '🔷',
    supportsExecution: true,
    defaultCode: `// Welcome to TypeScript Playground
interface Person {
  name: string;
  age: number;
}

function greet(person: Person): string {
  return "Hello, " + person.name + "! You are " + person.age + " years old.";
}

const user: Person = { name: "TypeScript", age: 12 };
console.log(greet(user));

const numbers: number[] = [1, 2, 3, 4, 5];
const doubled: number[] = [];

for (let i = 0; i < numbers.length; i++) {
  doubled.push(numbers[i] * 2);
}

console.log("Numbers:", numbers);
console.log("Doubled:", doubled);

function calculateSum(nums: number[]): number {
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
  }
  return sum;
}

const total = calculateSum(numbers);
console.log("Sum:", total);
console.log("Average:", total / numbers.length);
`
  },
  html: {
    id: 'html',
    name: 'HTML',
    monacoLanguage: 'html',
    fileExtension: 'html',
    icon: '🌐',
    supportsExecution: true,
    defaultCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML Playground</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
        }
        button {
            background: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌐 Welcome to HTML Playground</h1>
        <p>This is a simple HTML page with embedded CSS and JavaScript.</p>
        <button onclick="showAlert()">Click Me!</button>
        <button onclick="changeColor()">Change Color</button>
    </div>

    <script>
        function showAlert() {
            alert('Hello from HTML Playground!');
        }
        
        function changeColor() {
            const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            document.body.style.background = 'linear-gradient(135deg, ' + randomColor + ' 0%, #764ba2 100%)';
        }
    </script>
</body>
</html>
`
  },
  css: {
    id: 'css',
    name: 'CSS',
    monacoLanguage: 'css',
    fileExtension: 'css',
    icon: '🎨',
    supportsExecution: true,
    defaultCode: `/* Welcome to CSS Playground */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  max-width: 600px;
  width: 90%;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.card {
  background: #fff;
  padding: 1.5rem;
  margin: 1rem 0;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}
`
  },
  json: {
    id: 'json',
    name: 'JSON',
    monacoLanguage: 'json',
    fileExtension: 'json',
    icon: '📄',
    supportsExecution: true,
    defaultCode: `{
  "name": "JSON Playground",
  "version": "1.0.0",
  "description": "A sample JSON document",
  "author": {
    "name": "Online Editor",
    "email": "editor@example.com"
  },
  "features": [
    "Syntax highlighting",
    "Auto-completion",
    "Error detection",
    "Auto-quote formatting"
  ],
  "config": {
    "theme": "dark",
    "fontSize": 14,
    "wordWrap": true,
    "autoFormat": true
  },
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "active": true
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "active": false
    }
  ],
  "note": "Try removing quotes from keys/values and use Format to auto-fix!"
}
`
  },
  java: {
    id: 'java',
    name: 'Java',
    monacoLanguage: 'java',
    fileExtension: 'java',
    icon: '☕',
    supportsExecution: true,
    defaultCode: `// Welcome to Java Playground
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Try some basic Java operations
        int[] numbers = {1, 2, 3, 4, 5};
        int sum = 0;
        
        System.out.println("Numbers:");
        for (int number : numbers) {
            System.out.print(number + " ");
            sum += number;
        }
        
        System.out.println("\\nSum: " + sum);
        System.out.println("Average: " + (double)sum / numbers.length);
    }
}
`
  },
  cpp: {
    id: 'cpp',
    name: 'C++',
    monacoLanguage: 'cpp',
    fileExtension: 'cpp',
    icon: '⚡',
    supportsExecution: true,
    defaultCode: `// Welcome to C++ Playground
#include <iostream>
#include <vector>
#include <numeric>

int main() {
    std::cout << "Hello, World!" << std::endl;
    
    // Try some basic C++ operations
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    
    std::cout << "Numbers: ";
    for (const auto& num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    // Calculate sum using STL
    int sum = std::accumulate(numbers.begin(), numbers.end(), 0);
    std::cout << "Sum: " << sum << std::endl;
    std::cout << "Average: " << static_cast<double>(sum) / numbers.size() << std::endl;
    
    return 0;
}
`
  },
  c: {
    id: 'c',
    name: 'C',
    monacoLanguage: 'c',
    fileExtension: 'c',
    icon: '🔧',
    supportsExecution: true,
    defaultCode: `// Welcome to C Playground
#include <stdio.h>
#include <stdlib.h>

int main() {
    printf("Hello, World!\\n");
    
    // Try some basic C operations
    int numbers[] = {1, 2, 3, 4, 5};
    int size = sizeof(numbers) / sizeof(numbers[0]);
    int sum = 0;
    
    printf("Numbers: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", numbers[i]);
        sum += numbers[i];
    }
    
    printf("\\nSum: %d\\n", sum);
    printf("Average: %.2f\\n", (double)sum / size);
    
    return 0;
}
`
  },
  csharp: {
    id: 'csharp',
    name: 'C#',
    monacoLanguage: 'csharp',
    fileExtension: 'cs',
    icon: '🔷',
    supportsExecution: true,
    defaultCode: `// Welcome to C# Playground
using System;
using System.Linq;

class Program 
{
    static void Main() 
    {
        Console.WriteLine("Hello, World!");
        
        // Try some basic C# operations
        int[] numbers = {1, 2, 3, 4, 5};
        
        Console.WriteLine("Numbers: " + string.Join(" ", numbers));
        
        int sum = numbers.Sum();
        double average = numbers.Average();
        
        Console.WriteLine("Sum: " + sum);
        Console.WriteLine("Average: " + average);
        
        // LINQ example
        var evenNumbers = numbers.Where(n => n % 2 == 0);
        Console.WriteLine("Even numbers: " + string.Join(" ", evenNumbers));
    }
}
`
  },
  php: {
    id: 'php',
    name: 'PHP',
    monacoLanguage: 'php',
    fileExtension: 'php',
    icon: '🐘',
    supportsExecution: true,
    defaultCode: `<?php
// Welcome to PHP Playground
echo "Hello, World!\\n";

// Try some basic PHP operations
$numbers = [1, 2, 3, 4, 5];

echo "Numbers: " . implode(" ", $numbers) . "\\n";

$sum = array_sum($numbers);
$average = $sum / count($numbers);

echo "Sum: $sum\\n";
echo "Average: $average\\n";

// Array operations
$squared = array_map(function($n) { return $n * $n; }, $numbers);
echo "Squared: " . implode(" ", $squared) . "\\n";

// Associative array example
$person = [
    "name" => "PHP Developer",
    "age" => 25,
    "language" => "PHP"
];

echo "Person: " . $person["name"] . " (" . $person["age"] . " years old)\\n";
?>
`
  },
  ruby: {
    id: 'ruby',
    name: 'Ruby',
    monacoLanguage: 'ruby',
    fileExtension: 'rb',
    icon: '💎',
    supportsExecution: true,
    defaultCode: `# Welcome to Ruby Playground
puts "Hello, World!"

# Try some basic Ruby operations
numbers = [1, 2, 3, 4, 5]

puts "Numbers: #{numbers.join(' ')}"

sum = numbers.sum
average = sum.to_f / numbers.length

puts "Sum: #{sum}"
puts "Average: #{average}"

# Ruby blocks and methods
squared = numbers.map { |n| n * n }
puts "Squared: #{squared.join(' ')}"

even_numbers = numbers.select(&:even?)
puts "Even numbers: #{even_numbers.join(' ')}"

# Hash example
person = {
  name: "Ruby Developer",
  age: 28,
  language: "Ruby"
}

puts "Person: #{person[:name]} (#{person[:age]} years old)"
`
  },
  go: {
    id: 'go',
    name: 'Go',
    monacoLanguage: 'go',
    fileExtension: 'go',
    icon: '🐹',
    supportsExecution: true,
    defaultCode: `// Welcome to Go Playground
package main

import (
    "fmt"
)

func main() {
    fmt.Println("Hello, World!")
    
    // Try some basic Go operations
    numbers := []int{1, 2, 3, 4, 5}
    
    fmt.Print("Numbers: ")
    for _, num := range numbers {
        fmt.Print(num, " ")
    }
    fmt.Println()
    
    sum := 0
    for _, num := range numbers {
        sum += num
    }
    
    average := float64(sum) / float64(len(numbers))
    
    fmt.Printf("Sum: %d\\n", sum)
    fmt.Printf("Average: %.2f\\n", average)
    
    // Slice operations
    squared := make([]int, len(numbers))
    for i, num := range numbers {
        squared[i] = num * num
    }
    
    fmt.Print("Squared: ")
    for _, num := range squared {
        fmt.Print(num, " ")
    }
    fmt.Println()
}
`
  },
  rust: {
    id: 'rust',
    name: 'Rust',
    monacoLanguage: 'rust',
    fileExtension: 'rs',
    icon: '🦀',
    supportsExecution: true,
    defaultCode: `// Welcome to Rust Playground
fn main() {
    println!("Hello, World!");
    
    // Try some basic Rust operations
    let numbers = vec![1, 2, 3, 4, 5];
    
    println!("Numbers: {:?}", numbers);
    
    let sum: i32 = numbers.iter().sum();
    let average = sum as f64 / numbers.len() as f64;
    
    println!("Sum: {}", sum);
    println!("Average: {:.2}", average);
    
    // Iterator operations
    let squared: Vec<i32> = numbers.iter().map(|&x| x * x).collect();
    println!("Squared: {:?}", squared);
    
    let even_numbers: Vec<&i32> = numbers.iter().filter(|&&x| x % 2 == 0).collect();
    println!("Even numbers: {:?}", even_numbers);
    
    // Struct example
    struct Person {
        name: String,
        age: u32,
    }
    
    let person = Person {
        name: String::from("Rust Developer"),
        age: 30,
    };
    
    println!("Person: {} ({} years old)", person.name, person.age);
}
`
  },
  kotlin: {
    id: 'kotlin',
    name: 'Kotlin',
    monacoLanguage: 'kotlin',
    fileExtension: 'kt',
    icon: '🟣',
    supportsExecution: true,
    defaultCode: `// Welcome to Kotlin Playground
fun main() {
    println("Hello, World!")
    
    // Try some basic Kotlin operations
    val numbers = listOf(1, 2, 3, 4, 5)
    
    println("Numbers: " + numbers.joinToString(" "))
    
    val sum = numbers.sum()
    val average = numbers.average()
    
    println("Sum: " + sum)
    println("Average: " + average)
    
    // Collection operations
    val squared = numbers.map { it * it }
    println("Squared: " + squared.joinToString(" "))
    
    val evenNumbers = numbers.filter { it % 2 == 0 }
    println("Even numbers: " + evenNumbers.joinToString(" "))
    
    // Data class example
    data class Person(val name: String, val age: Int)
    
    val person = Person("Kotlin Developer", 27)
    println("Person: " + person.name + " (" + person.age + " years old)")
}
`
  },
  swift: {
    id: 'swift',
    name: 'Swift',
    monacoLanguage: 'swift',
    fileExtension: 'swift',
    icon: '🦉',
    supportsExecution: true,
    defaultCode: `// Welcome to Swift Playground
print("Hello, World!")

// Try some basic Swift operations
let numbers = [1, 2, 3, 4, 5]
print("Numbers: \\(numbers.map(String.init).joined(separator: " "))")

let sum = numbers.reduce(0, +)
let average = Double(sum) / Double(numbers.count)

print("Sum: \\(sum)")
print("Average: \\(average)")

// Array operations
let squared = numbers.map { $0 * $0 }
print("Squared: \\(squared.map(String.init).joined(separator: " "))")

let evenNumbers = numbers.filter { $0 % 2 == 0 }
print("Even numbers: \\(evenNumbers.map(String.init).joined(separator: " "))")

// Struct example
struct Person {
    let name: String
    let age: Int
}

let person = Person(name: "Swift Developer", age: 26)
print("Person: \\(person.name) (\\(person.age) years old)")
`
  }
};