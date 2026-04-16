import {
  forwardRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Button } from "../../components/Button";
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
    <div className="ui-comment-thread__comment" style={{ paddingLeft: `${depth * 24}px` }}>
      <div className="ui-comment-thread__header">
        <UserAvatar user={comment.author} size="sm" />
        <span className="ui-comment-thread__author">{comment.author.name}</span>
        <Timestamp date={comment.timestamp} format="auto" className="ui-comment-thread__time" />
      </div>
      <div className="ui-comment-thread__body">{comment.body}</div>
      {comment.reactions && comment.reactions.length > 0 && (
        <div className="ui-comment-thread__reactions">
          {comment.reactions.map((r) => (
            <button
              key={r.emoji}
              type="button"
              className={
                "ui-comment-thread__reaction" +
                (r.byMe ? " ui-comment-thread__reaction--mine" : "")
              }
              onClick={() => onReact?.(comment.id, r.emoji)}
            >
              <span aria-hidden>{r.emoji}</span>
              <span>{r.count}</span>
            </button>
          ))}
        </div>
      )}
      {onReply && (
        <div className="ui-comment-thread__actions">
          {!replying ? (
            <button
              type="button"
              className="ui-comment-thread__reply-trigger"
              onClick={() => setReplying(true)}
            >
              Reply
            </button>
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
              <textarea
                aria-label={`Reply to ${comment.author.name}`}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="ui-comment-thread__textarea"
              />
              <div className="ui-comment-thread__form-actions">
                <Button variant="ghost" size="sm" onClick={() => setReplying(false)} type="button">
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Reply
                </Button>
              </div>
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
    </div>
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
      <div ref={ref} className={classes} {...rest}>
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
            <textarea
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
      </div>
    );
  },
);
