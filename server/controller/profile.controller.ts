import { Request, Response } from 'express';
import database from '../database/database.js';

export const getProfile = async (req: Request, res: Response) => {
  try {
    let profile = await database.profile.findFirst();
    
    // If no profile exists, create a default one
    if (!profile) {
      profile = await database.profile.create({
        data: {
          name: 'Rohan',
          title: 'Creative Web Developer',
          bio: 'I craft high-end interactive websites using modern technologies like Next.js, Three.js, and GSAP.',
          heroTitle: 'CREATIVE\nDEVELOPER',
          heroSubtitle: 'Full Stack Web Developer',
          cvUrl: null,
          email: 'hello@rohan.com',
          github: 'https://github.com',
          linkedin: 'https://linkedin.com'
        }
      });
    }

    return res.status(200).json(profile);
  } catch (error: any) {
    console.error('Get profile error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, title, bio, heroTitle, heroSubtitle, cvUrl, email, github, linkedin } = req.body;

    let profile = await database.profile.findFirst();

    if (!profile) {
      // Create if it doesn't exist
      profile = await database.profile.create({
        data: {
          name: name || 'Rohan',
          title: title || 'Creative Web Developer',
          bio: bio || '',
          heroTitle: heroTitle || 'CREATIVE\nDEVELOPER',
          heroSubtitle: heroSubtitle || 'Full Stack Web Developer',
          cvUrl: cvUrl || null,
          email: email || null,
          github: github || null,
          linkedin: linkedin || null
        }
      });
    } else {
      // Update existing
      profile = await database.profile.update({
        where: { id: profile.id },
        data: {
          name: name !== undefined ? name : profile.name,
          title: title !== undefined ? title : profile.title,
          bio: bio !== undefined ? bio : profile.bio,
          heroTitle: heroTitle !== undefined ? heroTitle : profile.heroTitle,
          heroSubtitle: heroSubtitle !== undefined ? heroSubtitle : profile.heroSubtitle,
          cvUrl: cvUrl !== undefined ? cvUrl : profile.cvUrl,
          email: email !== undefined ? email : profile.email,
          github: github !== undefined ? github : profile.github,
          linkedin: linkedin !== undefined ? linkedin : profile.linkedin
        }
      });
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      profile
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const uploadCv = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Server-relative static URL for download
    const cvUrl = `/uploads/${req.file.filename}`;

    let profile = await database.profile.findFirst();

    if (!profile) {
      profile = await database.profile.create({
        data: {
          name: 'Rohan',
          title: 'Creative Web Developer',
          bio: 'I craft high-end interactive websites using modern technologies like Next.js, Three.js, and GSAP.',
          cvUrl,
        }
      });
    } else {
      profile = await database.profile.update({
        where: { id: profile.id },
        data: { cvUrl }
      });
    }

    return res.status(200).json({
      message: 'CV uploaded successfully',
      cvUrl,
      profile
    });
  } catch (error: any) {
    console.error('CV upload error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
