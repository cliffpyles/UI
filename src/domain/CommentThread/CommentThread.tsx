import {
  forwardRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Button } from "../../components/Button";
import { Textarea } from "../../components/Textarea";
import { UserAvatar, type UserData } from "../UserAvatar";
import { Timestamp } from "../Timestamp";
import "./CommentThread.css";

export interface Comment {
  id: string;
  author: UserData;
  body: ReactNode;
  timestamp: Date | string | number;
  replies?: Comment[];
  reactions?: { emoji: string; count: number; byMe?: boolean }[];
}

export interface CommentThreadProps extends HTMLAttributes<HTMLDivElement> {
  comments: Comment[];
  onAdd?: (body: string) => void;
  onReply?: (parentId: string, body: string) => void;
  onReact?: (id: string, emoji: string) => void;
  placeholder?: string;
}

interface CommentViewProps {
  comment: Comment;
  onReply?: (parentId: string, body: string) => void;
  onReact?: (id: string, emoji: string) => void;
  depth: number;
}

function CommentView({ comment, onReply, onReact, depth }: CommentViewProps) {
  const [replying, setReplying] = useState(false);
  const [reply, setReply] = useState("");

  return (
    <Box
      className="ui-comment-thread__comment"
      display="flex"
      direction="column"
      gap="1"
      style={{ paddingLeft: `${depth * 24}px` }}
    >
      <Box
        className="ui-comment-thread__header"
        display="flex"
        align="center"
        gap="2"
      >
        <UserAvatar user={comment.author} size="sm" />
        <Text as="span" weight="semibold" color="primary">
          {comment.author.name}
        </Text>
        <Timestamp date={comment.timestamp} format="auto" className="ui-comment-thread__time" />
      </Box>
      <div className="ui-comment-thread__body">{comment.body}</div>
      {comment.reactions && comment.reactions.length > 0 && (
        <Box
          className="ui-comment-thread__reactions"
          display="inline-flex"
          gap="1"
          wrap
        >
          {comment.reactions.map((r) => (
            <Button
              key={r.emoji}
              variant="ghost"
              size="sm"
              className={
                "ui-comment-thread__reaction" +
                (r.byMe ? " ui-comment-thread__reaction--mine" : "")
              }
              onClick={() => onReact?.(comment.id, r.emoji)}
            >
              <span aria-hidden>{r.emoji}</span>
              <span>{r.count}</span>
            </Button>
          ))}
        </Box>
      )}
      {onReply && (
        <div className="ui-comment-thread__actions">
          {!replying ? (
            <Button
              variant="ghost"
              size="sm"
              className="ui-comment-thread__reply-trigger"
              onClick={() => setReplying(true)}
            >
              Reply
            </Button>
          ) : (
            <form
              className="ui-comment-thread__form"
              onSubmit={(e) => {
                e.preventDefault();
                if (reply.trim()) {
                  onReply(comment.id, reply.trim());
                  setReply("");
                  setReplying(false);
                }
              }}
            >
              <Textarea
                aria-label={`Reply to ${comment.author.name}`}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="ui-comment-thread__textarea"
              />
              <Box
                className="ui-comment-thread__form-actions"
                display="inline-flex"
                gap="1"
                justify="end"
              >
                <Button variant="ghost" size="sm" onClick={() => setReplying(false)} type="button">
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Reply
                </Button>
              </Box>
            </form>
          )}
        </div>
      )}
      {comment.replies?.map((r) => (
        <CommentView
          key={r.id}
          comment={r}
          onReply={onReply}
          onReact={onReact}
          depth={depth + 1}
        />
      ))}
    </Box>
  );
}

export const CommentThread = forwardRef<HTMLDivElement, CommentThreadProps>(
  function CommentThread(
    { comments, onAdd, onReply, onReact, placeholder = "Add comment…", className, ...rest },
    ref,
  ) {
    const [draft, setDraft] = useState("");
    const classes = ["ui-comment-thread", className].filter(Boolean).join(" ");

    return (
      <Box
        ref={ref as Ref<HTMLElement>}
        className={classes}
        display="flex"
        direction="column"
        gap="3"
        {...rest}
      >
        {comments.map((c) => (
          <CommentView
            key={c.id}
            comment={c}
            onReply={onReply}
            onReact={onReact}
            depth={0}
          />
        ))}
        {onAdd && (
          <form
            className="ui-comment-thread__form"
            onSubmit={(e) => {
              e.preventDefault();
              if (draft.trim()) {
                onAdd(draft.trim());
                setDraft("");
              }
            }}
          >
            <Textarea
              aria-label="Add comment"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={placeholder}
              className="ui-comment-thread__textarea"
            />
            <Button variant="primary" size="sm" type="submit">
              Comment
            </Button>
          </form>
        )}
      </Box>
    );
  },
);
