import { Request, Response } from 'express';
import database from '../database/database.js';

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const projects = await database.project.findMany({
      orderBy: { order: 'asc' },
    });
    return res.status(200).json(projects);
  } catch (error: any) {
    console.error('Get all projects error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const { title, description, imageUrl, demoLink, githubLink, tags, featured, order } = req.body;

    if (!title || !description || !tags) {
      return res.status(400).json({ error: 'Title, description, and tags are required' });
    }

    const project = await database.project.create({
      data: {
        title,
        description,
        imageUrl: imageUrl || null,
        demoLink: demoLink || null,
        githubLink: githubLink || null,
        tags,
        featured: featured === true || featured === 'true',
        order: order ? parseInt(order.toString(), 10) : 0,
      },
    });

    return res.status(201).json({
      message: 'Project created successfully',
      project,
    });
  } catch (error: any) {
    console.error('Create project error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, demoLink, githubLink, tags, featured, order } = req.body;

    const projectId = parseInt(id, 10);
    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    // Check if project exists
    const existingProject = await database.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = await database.project.update({
      where: { id: projectId },
      data: {
        title: title !== undefined ? title : existingProject.title,
        description: description !== undefined ? description : existingProject.description,
        imageUrl: imageUrl !== undefined ? imageUrl : existingProject.imageUrl,
        demoLink: demoLink !== undefined ? demoLink : existingProject.demoLink,
        githubLink: githubLink !== undefined ? githubLink : existingProject.githubLink,
        tags: tags !== undefined ? tags : existingProject.tags,
        featured: featured !== undefined ? (featured === true || featured === 'true') : existingProject.featured,
        order: order !== undefined ? parseInt(order.toString(), 10) : existingProject.order,
      },
    });

    return res.status(200).json({
      message: 'Project updated successfully',
      project,
    });
  } catch (error: any) {
    console.error('Update project error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const projectId = parseInt(id, 10);
    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const existingProject = await database.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await database.project.delete({
      where: { id: projectId },
    });

    return res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    console.error('Delete project error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
