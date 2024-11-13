import { Button, Card, Checkbox, Dropdown, Flex, Form, FormListFieldData, Image, Modal, Tag, Typography } from 'antd';
import { UserInfo } from '../user/user-info';
import { PostTag } from './post-tag';
import {
    BarChartOutlined,
    CommentOutlined,
    DeleteOutlined,
    EditOutlined,
    EllipsisOutlined,
    ExclamationCircleOutlined,
    EyeInvisibleOutlined,
    EyeOutlined,
    GlobalOutlined,
    KeyOutlined,
    LikeFilled,
    LikeOutlined,
    ShareAltOutlined,
    TagOutlined,
} from '@ant-design/icons';
import { IconButton } from './icon-button';
import { useDispatch } from 'react-redux';
import { setPost } from '@/stores/post';
import { useDeletePost } from '@/hooks/mutate/post/use-delete-post';
import { Post } from '@/types/post/post';
import { FC, useState } from 'react';
import dayjsConfig from '@/utils/dayjs';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { postKeys } from '@/consts/factory/post';
import { useMessage } from '@/hooks/use-message';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores';
import { useToggleUpvote } from '@/hooks/mutate/upvote/use-toggle-upvote';
import { useUpvoteListing } from '@/hooks/query/upvote/use-upvote-listing';
import { upvoteKeys } from '@/consts/factory/upvote';
import PostComment from './post-comment';
import { useToggleBookmark } from '@/hooks/mutate/bookmark/use-toggle-bookmark';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { useBookmarkListing } from '@/hooks/query/bookmark/use-bookmark-listing';
import { bookmarkKeys } from '@/consts/factory/bookmark';
import { PATHS } from '@/utils/paths';

const { confirm } = Modal;

interface PostItemProps {
    data: Post;
    showActions?: boolean;
    showCheckbox?: boolean;
    field?: FormListFieldData;
    showLike?: boolean;
    extra?: React.ReactNode;
    showComment?: boolean;
}

export const PostItem: FC<PostItemProps> = ({
    data,
    showActions = true,
    showCheckbox = false,
    showLike = true,
    field,
    extra,
    showComment = false,
}) => {
    const { title, content, createdDate, imageList, tag, postId, topic, linkFile } = data;

    const { id } = useParams();
    const navigate = useNavigate();
    const { accountInfo } = useSelector((state: RootState) => state.account);
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const { success } = useMessage();

    const [searchParams] = useSearchParams();

    const [isShowComment, setIsShowComment] = useState(showComment);

    const { data: upvotes } = useUpvoteListing();
    const { data: bookmarks } = useBookmarkListing();
    const { mutate: toggleBookmark, isPending: isPendingToggleBookmark } = useToggleBookmark();
    const { mutate: upvote, isPending: isPendingUpvote } = useToggleUpvote();

    const { mutate: deletePost, isPending: isPendingDeletePost } = useDeletePost(postId, {
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: postKeys.listing(),
            });
            success('Post deleted successfully!');
        },
    });

    const handleUpdate = () => {
        dispatch(setPost({ modal: { open: true, type: 'update' }, id: postId }));
    };

    const handleDelete = () => {
        confirm({
            title: 'Are you sure you want to delete this post?',
            content: 'This action cannot be undone',
            onOk() {
                deletePost();
            },
            okButtonProps: {
                disabled: isPendingDeletePost,
            },
        });
    };

    const handleReport = () => {
        dispatch(setPost({ modal: { open: true, type: 'report' }, id: postId }));
    };

    const copyLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/posts/${postId}`);
        success('Link copied to clipboard!');
    };

    const handleUpvote = (id: string) => {
        upvote(id, {
            onSuccess: () => {
                // queryClient.invalidateQueries({
                //     queryKey: postKeys.listing(),
                // });
                queryClient.invalidateQueries({
                    queryKey: upvoteKeys.listing(),
                });
            },
        });
    };

    const handleBookmark = (id: string) => {
        toggleBookmark(
            { postId: id },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: bookmarkKeys.listing(),
                    });
                },
            },
        );
    };

    const handleComment = () => {
        setIsShowComment(!isShowComment);
    };

    const isAllowShowActions =
        accountInfo?.role?.name === 'ADMIN' ||
        accountInfo?.role?.name === 'STAFF' ||
        data?.account?.accountId === accountInfo?.accountId;
    const isAllowShowReport =
        accountInfo?.role?.name === 'ADMIN' ||
        accountInfo?.role?.name === 'STAFF' ||
        data?.account?.accountId !== accountInfo?.accountId;

    return (
        <Card style={{ cursor: 'pointer' }}>
            <Flex vertical gap={8}>
                <Flex justify="space-between" align="flex-start">
                    <Flex align="center" gap={8}>
                        <UserInfo account={data.account} />
                        {topic && (
                            <Tag
                                style={{
                                    padding: '0 10px',
                                    fontSize: 16,
                                    height: 24,
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                {topic?.name}
                            </Tag>
                        )}
                        {tag && (
                            <PostTag backgroundColor={tag?.backgroundColorHex} textColor={tag?.textColorHex}>
                                <TagOutlined style={{ marginRight: 8 }} />
                                {tag?.name}
                            </PostTag>
                        )}
                    </Flex>
                    <Flex align="center" gap={8}>
                        {showActions && isAllowShowActions && (
                            <Dropdown
                                menu={{
                                    items: [
                                        {
                                            key: '1',
                                            icon: <GlobalOutlined />,
                                            label: <span>Public</span>,
                                            children: [
                                                {
                                                    key: '1.1',
                                                    icon: <GlobalOutlined />,
                                                    label: <span>Public</span>,
                                                },
                                                {
                                                    key: '1.2',
                                                    icon: <KeyOutlined />,
                                                    label: <span>Private</span>,
                                                },
                                                {
                                                    key: '1.3',
                                                    icon: <EyeInvisibleOutlined />,
                                                    label: <span>Hide</span>,
                                                },
                                            ],
                                        },
                                        {
                                            key: '2',
                                            icon: <EditOutlined />,
                                            label: <span>Edit post</span>,
                                            onClick: handleUpdate,
                                        },
                                        {
                                            key: '3',
                                            icon: <DeleteOutlined />,
                                            label: <span>Delete post</span>,
                                            onClick: handleDelete,
                                        },
                                    ],
                                }}
                            >
                                <Button type="text" icon={<EllipsisOutlined style={{ fontSize: 20 }} />} />
                            </Dropdown>
                        )}
                        {!id && (
                            <IconButton
                                icon={<EyeOutlined />}
                                children=""
                                onClick={() => navigate(PATHS.POST_DETAIL.replace(':id', data?.postId))}
                            />
                        )}
                    </Flex>

                    {showCheckbox && field && (
                        <Form.Item name={[field.name, 'checked']} valuePropName="checked">
                            <Checkbox />
                        </Form.Item>
                    )}
                    {extra && extra}
                </Flex>

                <Typography.Title
                    level={4}
                    style={{
                        textDecoration: 'underline',
                        cursor: 'pointer',
                    }}
                >
                    {title}
                </Typography.Title>

                <Typography.Paragraph
                    ellipsis={{
                        rows: 8,
                        expandable: true,
                        symbol: <Button type="link">more</Button>,
                    }}
                >
                    {content}
                </Typography.Paragraph>

                <Flex gap={10} wrap>
                    {imageList?.map(file => (
                        <div className="ant-upload" key={file.imageId}>
                            <Image src={file.url} alt={file.url} />
                        </div>
                    ))}
                </Flex>

                <Link to={linkFile} target="_blank">
                    {linkFile}
                </Link>

                <Typography.Text type="secondary">Posted {dayjsConfig(createdDate).fromNow()}</Typography.Text>

                <Flex gap={32} vertical>
                    {showLike && (
                        <Flex justify="end" gap={20}>
                            <IconButton
                                icon={
                                    !upvotes?.find(
                                        upvote =>
                                            upvote?.post?.postId === data?.postId &&
                                            upvote?.account?.accountId === accountInfo?.accountId,
                                    ) ? (
                                        <LikeOutlined />
                                    ) : (
                                        <LikeFilled
                                            color="#007AFF"
                                            style={{
                                                color: '#007AFF',
                                            }}
                                        />
                                    )
                                }
                                children={
                                    <Typography.Text
                                        style={{
                                            color: !upvotes?.find(
                                                upvote =>
                                                    upvote?.post?.postId === data?.postId &&
                                                    upvote?.account?.accountId === accountInfo?.accountId,
                                            )
                                                ? 'unset'
                                                : '#007AFF',
                                        }}
                                    >
                                        Like
                                    </Typography.Text>
                                }
                                onClick={() => handleUpvote(data?.postId)}
                                disabled={isPendingUpvote}
                            />
                            <IconButton icon={<CommentOutlined />} children="Comment" onClick={handleComment} />
                            <IconButton icon={<ShareAltOutlined />} children="Share" onClick={copyLink} />
                            {bookmarks?.find(bookmark => bookmark?.postId === data?.postId) ? (
                                <IconButton
                                    icon={
                                        <FaBookmark
                                            style={{
                                                color: '#EEA956',
                                            }}
                                        />
                                    }
                                    children="Bookmark"
                                    onClick={() => handleBookmark(data?.postId)}
                                    disabled={isPendingToggleBookmark}
                                />
                            ) : (
                                <IconButton
                                    icon={<FaRegBookmark />}
                                    children="Bookmark"
                                    onClick={() => handleBookmark(data?.postId)}
                                    disabled={isPendingToggleBookmark}
                                />
                            )}
                            {isAllowShowReport && (
                                <IconButton
                                    icon={<ExclamationCircleOutlined />}
                                    children="Report"
                                    onClick={handleReport}
                                />
                            )}
                        </Flex>
                    )}

                    {isShowComment && <PostComment postId={data?.postId} isShown={isShowComment} />}
                </Flex>
            </Flex>
        </Card>
    );
};
