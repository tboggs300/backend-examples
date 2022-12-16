package main

import (
	"fmt"
	"log"
	"net/http"
)

func formHandler(writer http.ResponseWriter, req *http.Request) {
	if err := req.ParseForm(); err != nil {
		fmt.Fprintf(writer, "ParseForm() err: %v", err)
		return
	}

	fmt.Fprintf(writer, "POST request successful.\n")
	name := req.FormValue("name")
	address := req.FormValue("address")
	fmt.Fprintf(writer, "Name = %s\n", name)
	fmt.Fprintf(writer, "Address = %s\n", address)
}

func helloHandler(writer http.ResponseWriter, req *http.Request) {
	if req.URL.Path != "/hello" {
		http.Error(writer, "404 not found.", http.StatusNotFound)
		return
	}

	if req.Method != "GET" {
		http.Error(writer, "Request method not supported.", http.StatusNotImplemented)
		return
	}

	fmt.Fprintf(writer, "Hello!")

}

func main() {
	fileServer := http.FileServer(http.Dir("./static"))
	http.Handle("/", fileServer)
	http.HandleFunc("/form", formHandler)
	http.HandleFunc("/hello", helloHandler)

	fmt.Printf("Starting server on port 8080\n")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("err")
	}
}
