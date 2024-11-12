import { Card, Flex, Image, Tag, Typography } from 'antd';
import PlaceholderSvg from '/public/placeholder.svg';
import ArrowRightSvg from '/public/arrow-right.svg';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/utils/paths';
import { Category } from '@/types/category/category';
import { FC } from 'react';

const programmingLanguages = [
    'JavaScript',
    'TypeScript',
    'Python',
    'Java',
    'C#',
    'PHP',
    'Ruby',
    'Go',
    'Swift',
    'Kotlin',
    'Rust',
    'Scala',
];

interface PostSummaryProps {
    data: Category;
}

export const PostSummary: FC<PostSummaryProps> = ({ data }) => {
    const navigate = useNavigate();

    const { image, name, categoryId, upvoteCount, commentCount, description, topicListByCategory } = data;

    const toPost = () => {
        navigate(`${PATHS.POSTS}?category=${categoryId}`);
    };

    return (
        <Card style={{ cursor: 'pointer' }} onClick={toPost}>
            <Flex vertical gap={10}>
                <Flex gap={20}>
                    <Image
                        style={{ borderRadius: 16, width: 156, height: 156, objectFit: 'contain' }}
                        src={image ?? PlaceholderSvg}
                        alt="post"
                        preview={false}
                    />

                    <Flex vertical justify="space-between" gap={10}>
                        <Flex vertical gap={10}>
                            <Flex justify="space-between" align="center">
                                <Typography.Title level={4} style={{ textTransform: 'uppercase' }}>
                                    {name}
                                </Typography.Title>

                                <img src={ArrowRightSvg} />
                            </Flex>

                            <Flex gap={20} wrap>
                                {topicListByCategory?.map(text => (
                                    <Tag
                                        key={text?.topicId}
                                        onClick={e => {
                                            e.stopPropagation();
                                            navigate(`${PATHS.POSTS}?category=${categoryId}&topicId=${text?.topicId}`);
                                        }}
                                    >
                                        {text?.name}
                                    </Tag>
                                ))}
                            </Flex>
                        </Flex>

                        <Flex gap={32}>
                            <Typography.Text>651,324 Views</Typography.Text>
                            <Typography.Text>{upvoteCount} Likes</Typography.Text>
                            <Typography.Text>{commentCount} Comments</Typography.Text>
                        </Flex>
                    </Flex>
                </Flex>

                <Typography.Paragraph>{description}</Typography.Paragraph>
            </Flex>
        </Card>
    );
};
