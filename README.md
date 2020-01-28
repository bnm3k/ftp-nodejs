### 1. Introduction

The following is an overview of, to use a lofty term, the 'architecture' of a File Transfer Protocol (FTP) client and server implementation I wrote in javascript (node.js). It covers the overall design, various considerations, decisions and protocols, messaging protocols and caveats, particularly in ways that deviate from standardized FTP. The code is entirely open-source. I took up working on this FTP program so as to challenge myself to code a non-trivial, non-web-dev intermediate level node.js project. As such, the code is mostly learning-oriented rather than production-oriented. Regrettably, I did not write much tests, instead relying on 'hand-testing' as I went along. I hope though to add tests soon enough.

### 2. Code structure

### 3. Setting up the Client CLI

### 4. Implementing Client-side commands

### 5. Setting up the Server

### 6. The Client-Server Message protocol

### 7. FDTree: Exposing a logical file-system

### 8. Importing directories

### 9. Implementing Server-side commands

### 10. Reliable File Transfer

### 11. Security and Encryption

### 12. Conclusion
