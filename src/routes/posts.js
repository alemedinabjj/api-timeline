import { Router } from "express";
import { prisma } from "../utils/prisma.js";

const server = Router();

server.post('/create', async (req, res) => {
  const { content } = req.body;

  const errors = {};

  if (!content) {
    errors.contentRequired = 'Content is required';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const post = await prisma.posts.create({
    data: {
      content,
      authorId: req.userId,
    },
  });

  return res.json({ post });
})

server.put('/post/:id', async (req, res) => {

  const { id } = req.params;
  const { content } = req.body;

  const errors = {};

  if (!content) {
    errors.contentRequired = 'Content is required';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const post = await prisma.posts.update({
    where: {
      id: id,
    },
    data: {
      content,
    },
  });

  return res.json({ post });

})

server.delete('/post/:id', async (req, res) => {
  
    const { id } = req.params;

    const errors = {};

    if (!id) {
      errors.idRequired = 'Id is requ ired';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }
  
    const post = await prisma.posts.delete({
      where: {
        id: id,
      },
    });
  
    return res.json({ post });
  
})

server.post('/post/:id/like', async (req, res) => {
  const { id } = req.params;
  const userId = req.userId; 

  const errors = {};

  if (!id) {
    errors.idRequired = 'Id is required';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const postLike = await prisma.likes.findFirst({
    where: {
      authorId: userId,
      postId: id,
    },
  });

  if (postLike) {
    return res.status(400).json({ error: 'Post already liked' });
  }

  try {
    const postLike = await prisma.likes.create({
      data: {
        authorId: userId,
        postId: id,
      },
    });

    return res.json({ postLike });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


server.delete('/post/:id/like', async (req, res) => {
  const { id } = req.params;

  const errors = {};

  if (!id) {
    errors.idRequired = 'Id is required';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const postLike = await prisma.likes.delete({
      where: {
        authorId: req.userId,
        postId: id,
      },
    });

    return res.json({ postLike });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }

});

server.post('/post/:id/comments', async (req, res) => {
  const { id } = req.params;

  const { content } = req.body;

  const errors = {};

  if (!id) {
    errors.idRequired = 'Id is required';
  }

  if (!content) {
    errors.contentRequired = 'Content is required';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const comment = await prisma.comments.create({
      data: {
        content,
        authorId: req.userId,
        postId: id,
      },
    });

    return res.json({ comment });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }

});

server.delete('/post/:id/comments/:commentId', async (req, res) => {
  const { id, commentId } = req.params;

  const errors = {};

  if (!id) {
    errors.idRequired = 'Id is required';
  }

  if (!commentId) {
    errors.commentIdRequired = 'Comment id is required';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const comment = await prisma.comments.delete({
      where: {
        id: commentId,
      },
    });

    return res.json({ comment });

  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }

});


  server.get('/post/:id/likes', async (req, res) => {
    const { id } = req.params;

    const errors = {};

    if (!id) {
      errors.idRequired = 'Id is required';
    }
  
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    try {
      const likesCount = await prisma.likes.count({
        where: {  
          postId: id,
        },
      });

      return res.json({ likesCount });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });


  server.get('/all-posts', async (req, res) => {
    
      const posts = await prisma.posts.findMany({
        orderBy: {
          createdAt: 'desc',
        },

        include: {
          author: {
            select: {
              username: true,
            },
          },

          likes: {
            select: {
              authorId: true,
            },
          },

          comments: {
            include: {
              author: {
                select: {
                  username: true,
                },
              },
            }
          }
       
        },
      });

      return res.json({ posts });

  })

export default server;
