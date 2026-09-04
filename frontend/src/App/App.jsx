import "./App.css"
import {Editor} from "@monaco-editor/react"
import {MonacoBinding} from "y-monaco"
import { useRef} from "react"
import * as Y from "yjs"
import {WebsocketProvider} from "y-websocket"





function App() {
  
  const editorRef = useRef(null)

  const handleMount=(editor)=>{
    editorRef.current = editor
  }

  return (
   <main className="h-screen w-full bg-gray-950 flex gap-4 p-2">
    <aside className="h-full w-2/5 bg-amber-50 rounded-lg">
    
    </aside>
   
    <section className="w-3/4 bg-neutral-800 rounded-lg overflow-hidden">
    <Editor
      height="100%"
      width="100%"
      theme="vs-dark"
      language="javascript"
      value="// Write your code here"
      options={{
        fontSize: 16,
        minimap: { enabled: false },
        automaticLayout: true,
        wordWrap: "on"
      }}
    />
    </section>
    
   </main>

  )
}

export default App