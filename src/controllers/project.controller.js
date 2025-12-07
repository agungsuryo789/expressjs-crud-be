import { prisma } from "../config/prisma.js";

export const createProject = async (req, res) => {
  try {
    const { title, slug, description, content, liveUrl, repoUrl, featured } =
      req.body;

    if (!title || !slug || !content || !description) {
      return res
        .status(400)
        .json({ message: "title, slug and content are required" });
    }

    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing)
      return res.status(409).json({ message: "Slug already in use" });

    const data = {
      title,
      slug,
      description,
      content,
      featured: Boolean(featured),
      liveUrl: liveUrl ?? null,
      repoUrl: repoUrl ?? null,
      author: { connect: { id: req.user.id } },
    };

    const project = await prisma.project.create({ data });

    return res.status(201).json({ success: true, project });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};



export const getAllProjects = async (req, res) => {
  try {
    const { featured } = req.query;

    const where = {};
    if (featured !== undefined) {
      where.featured = String(featured).toLowerCase() === "true";
    }

    const project = await prisma.project.findMany({
      where,
      include: {
        author: { select: { id: true, email: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ success: true, project });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};



export const getProjectById = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) return res.status(400).json({ message: "Project slug is required" });

    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, email: true, name: true } },
      },
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    return res.json({ success: true, project });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Project id is required" });

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const requesterId = req.user?.id;
    const requesterRole = req.user?.role;

    if (requesterId !== project.authorId && requesterRole !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden: not allowed to delete this project" });
    }

    const deleted = await prisma.project.delete({ where: { id } });

    return res.json({ success: true, deleted });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, description, content, liveUrl, repoUrl, featured } = req.body;

    if (!id) return res.status(400).json({ message: 'Project id is required' });

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const requesterId = req.user?.id;
    const requesterRole = req.user?.role;
    if (requesterId !== project.authorId && requesterRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden: not allowed to update this project' });
    }

    const data = {};
    if (title !== undefined) data.title = title;
    if (slug !== undefined && slug !== project.slug) {
      const exists = await prisma.project.findUnique({ where: { slug } });
      if (exists) return res.status(409).json({ message: 'Slug already in use' });
      data.slug = slug;
    }
    if (description !== undefined) data.description = description;
    if (content !== undefined) data.content = content;
    if (liveUrl !== undefined) data.liveUrl = liveUrl;
    if (repoUrl !== undefined) data.repoUrl = repoUrl;
    if (featured !== undefined) data.featured = Boolean(featured);

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: 'No fields provided to update' });
    }

    const updated = await prisma.project.update({ where: { id }, data });
    return res.json({ success: true, project: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
