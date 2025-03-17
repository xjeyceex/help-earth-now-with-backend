import { Link, RichTextEditor as MantineRichTextEditor } from "@mantine/tiptap";
import Highlight from "@tiptap/extension-highlight";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { forwardRef, useImperativeHandle } from "react";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export type RichTextEditorRef = {
  reset: () => void;
};

export const RichTextEditor = forwardRef<
  RichTextEditorRef,
  RichTextEditorProps
>(({ value, onChange }, ref) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Expose the reset method through ref
  useImperativeHandle(ref, () => ({
    reset: () => {
      editor?.commands.setContent("");
    },
  }));

  return (
    <MantineRichTextEditor editor={editor} mih={150}>
      <MantineRichTextEditor.Toolbar sticky stickyOffset={60}>
        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.Bold />
          <MantineRichTextEditor.Italic />
          <MantineRichTextEditor.Underline />
          <MantineRichTextEditor.Strikethrough />
          <MantineRichTextEditor.ClearFormatting />
          <MantineRichTextEditor.Highlight />
          <MantineRichTextEditor.Code />
        </MantineRichTextEditor.ControlsGroup>

        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.H1 />
          <MantineRichTextEditor.H2 />
          <MantineRichTextEditor.H3 />
          <MantineRichTextEditor.H4 />
        </MantineRichTextEditor.ControlsGroup>

        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.Blockquote />
          <MantineRichTextEditor.Hr />
          <MantineRichTextEditor.BulletList />
          <MantineRichTextEditor.OrderedList />
          <MantineRichTextEditor.Subscript />
          <MantineRichTextEditor.Superscript />
        </MantineRichTextEditor.ControlsGroup>

        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.Link />
          <MantineRichTextEditor.Unlink />
        </MantineRichTextEditor.ControlsGroup>

        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.AlignLeft />
          <MantineRichTextEditor.AlignCenter />
          <MantineRichTextEditor.AlignJustify />
          <MantineRichTextEditor.AlignRight />
        </MantineRichTextEditor.ControlsGroup>

        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.Undo />
          <MantineRichTextEditor.Redo />
        </MantineRichTextEditor.ControlsGroup>
      </MantineRichTextEditor.Toolbar>

      <MantineRichTextEditor.Content />
    </MantineRichTextEditor>
  );
});

RichTextEditor.displayName = "RichTextEditor";
