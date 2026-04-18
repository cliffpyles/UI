import {
  forwardRef,
  useId,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { Box } from "../../primitives/Box";
import { Text } from "../../primitives/Text";
import { Button } from "../../components/Button";
import { Textarea } from "../../components/Textarea";
import { UserChip } from "../UserChip";
import { UserAvatar, type UserData } from "../UserAvatar";
import { Timestamp } from "../Timestamp";
import "./CommentThread.css";

export interface CommentNode {
  id: string;
  author: UserData;
  body: ReactNode;
  createdAt: Date | string | number;
  reactions?: { emoji: string; count: number; reactedByMe?: boolean }[];
  replies?: CommentNode[];
}

export interface CommentThreadProps extends Omit<HTMLAttributes<HTMLElement>, "onSubmit"> {
  comments: CommentNode[];
  currentUser?: UserData;
  onSubmit?: (body: string, parentId: string | null) => void;
  onReact?: (commentId: string, emoji: string) => void;
  maxDepth?: number;
  loading?: boolean;
}

interface CommentViewProps {
  comment: CommentNode;
  depth: number;
  maxDepth: number;
  onSubmit?: (body: string, parentId: string | null) => void;
  onReact?: (commentId: string, emoji: string) => void;
}

function CommentView({ comment, depth, maxDepth, onSubmit, onReact }: CommentViewProps) {
  const [replying, setReplying] = useState(false);
  const [reply, setReply] = useState("");
  const headerId = useId();
  const clampedDepth = Math.min(depth, maxDepth);

  return (
    <Box
      as="article"
      role="article"
      aria-labelledby={headerId}
      className="ui-comment-thread__comment"
      direction="column"
      gap="1"
      style={{ paddingInlineStart: `calc(var(--comment-thread-indent-step) * ${clampedDepth})` }}
    >
      <Box direction="row" align="center" gap="2" className="ui-comment-thread__header">
        <UserChip user={comment.author} id={headerId} />
        <Timestamp date={comment.createdAt} format="auto" className="ui-comment-thread__time" />
      </Box>
      <Text as="p" size="sm" className="ui-comment-thread__body">
        {comment.body}
      </Text>
      {comment.reactions && comment.reactions.length > 0 && (
        <Box direction="row" gap="1" wrap className="ui-comment-thread__reactions">
          {comment.reactions.map((r) => (
            <Button
              key={r.emoji}
              variant="ghost"
              size="sm"
              aria-pressed={!!r.reactedByMe}
              aria-label={`React ${r.emoji}`}
              className="ui-comment-thread__reaction"
              onClick={() => onReact?.(comment.id, r.emoji)}
            >
              <Text as="span" aria-hidden>{r.emoji}</Text>
              <Text as="span">{r.count}</Text>
            </Button>
          ))}
        </Box>
      )}
      {onSubmit && (
        <Box direction="column" gap="1" className="ui-comment-thread__actions">
          {!replying ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplying(true)}
            >
              Reply
            </Button>
          ) : (
            <Box as="section" direction="column" gap="1" className="ui-comment-thread__form">
              <Textarea
                aria-label={`Reply to ${comment.author.name}`}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="ui-comment-thread__textarea"
              />
              <Box direction="row" gap="1" justify="end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setReplying(false);
                    setReply("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    if (reply.trim()) {
                      onSubmit(reply.trim(), comment.id);
                      setReply("");
                      setReplying(false);
                    }
                  }}
                >
                  Post reply
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      )}
      {comment.replies?.map((r) => (
        <CommentView
          key={r.id}
          comment={r}
          depth={clampedDepth + 1}
          maxDepth={maxDepth}
          onSubmit={onSubmit}
          onReact={onReact}
        />
      ))}
    </Box>
  );
}

export const CommentThread = forwardRef<HTMLElement, CommentThreadProps>(
  function CommentThread(
    {
      comments,
      currentUser,
      onSubmit,
      onReact,
      maxDepth = 3,
      loading = false,
      className,
      ...rest
    },
    ref,
  ) {
    const [draft, setDraft] = useState("");
    const classes = ["ui-comment-thread", className].filter(Boolean).join(" ");

    return (
      <Box
        as="section"
        ref={ref as Ref<HTMLElement>}
        aria-label="Comments"
        aria-busy={loading || undefined}
        className={classes}
        direction="column"
        gap="3"
        {...rest}
      >
        {loading && (
          <Box direction="column" gap="2" aria-hidden className="ui-comment-thread__skeletons">
            <Box className="ui-comment-thread__skeleton" />
            <Box className="ui-comment-thread__skeleton" />
            <Box className="ui-comment-thread__skeleton" />
          </Box>
        )}
        {!loading &&
          comments.map((c) => (
            <CommentView
              key={c.id}
              comment={c}
              depth={0}
              maxDepth={maxDepth}
              onSubmit={onSubmit}
              onReact={onReact}
            />
          ))}
        {onSubmit && (
          <Box as="section" direction="column" gap="1" className="ui-comment-thread__composer">
            {currentUser && <UserAvatar user={currentUser} size="sm" />}
            <Textarea
              aria-label="New comment"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="ui-comment-thread__textarea"
            />
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                if (draft.trim()) {
                  onSubmit(draft.trim(), null);
                  setDraft("");
                }
              }}
            >
              Comment
            </Button>
          </Box>
        )}
      </Box>
    );
  },
);
