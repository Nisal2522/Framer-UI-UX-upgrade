import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type KnowledgeMaterial = {
  id: string;
  title: string;
  description: string;
  contentType: string;
  documentType: string;
  targetCrop: string;
  uploadDate: string;
  uploadedBy: string;
  uploaderRole: string;
  status: string;
  downloads: number;
  views: number;
  fileSize: string;
  tags: string[];
  coverKind: 'image' | 'pdf' | 'video';
  coverImageUrl?: string;
  stagePill: string;
};

@Component({
  selector: 'app-knowledge-management-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './knowledge-management-page.component.html',
  styleUrl: './knowledge-management-page.component.scss'
})
export class KnowledgeManagementPageComponent {
  readonly uploadDrawerOpen = signal(false);
  readonly searchTerm = signal('');
  readonly selectedTags = signal<string[]>([]);

  readonly availableTags = [
    'Rice',
    'Vegetables',
    'Organic',
    'Pest Management',
    'Fertilizer',
    'Irrigation',
    'Market Prices',
    'Training',
    'Best Practices',
    'Certification'
  ];

  readonly materials: KnowledgeMaterial[] = [
    {
      id: 'KM-001',
      title: 'Farm Irrigation Visual Guide',
      description: 'Comprehensive guide for organic rice cultivation techniques and pest management',
      contentType: 'Agricultural Techniques',
      documentType: 'Video',
      targetCrop: 'Rice',
      uploadDate: '2024-03-21',
      uploadedBy: 'Extension Media Unit',
      uploaderRole: 'Agricultural Officer',
      status: 'Published',
      downloads: 234,
      views: 764,
      fileSize: '1.3 MB',
      tags: ['Irrigation', 'Visual', 'Guide'],
      coverKind: 'video',
      coverImageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&h=400&q=80',
      stagePill: 'Developing'
    },
    {
      id: 'KM-002',
      title: 'Market Price Analysis - March 2024',
      description: 'Monthly analysis of agricultural commodity prices across Cambodia including rice, cassava, and vegetables',
      contentType: 'Market Price Update',
      documentType: 'PDF Document',
      targetCrop: 'All Crop Types',
      uploadDate: '2024-03-01',
      uploadedBy: 'Ministry Committee',
      uploaderRole: 'Ministry Committee',
      status: 'Published',
      downloads: 456,
      views: 1204,
      fileSize: '890 KB',
      tags: ['Market Prices', 'Rice', 'Vegetables'],
      coverKind: 'pdf',
      coverImageUrl: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=600&h=400&q=80',
      stagePill: 'All Stages'
    },
    {
      id: 'KM-003',
      title: 'Organic Fertilizer Production Training',
      description: 'Step-by-step video tutorial on producing organic compost and bio-fertilizers for sustainable farming',
      contentType: 'Training Video',
      documentType: 'Video',
      targetCrop: 'All Crop Types',
      uploadDate: '2024-02-20',
      uploadedBy: 'Training Coordinator',
      uploaderRole: 'FAO/PEARL Officer',
      status: 'Published',
      downloads: 189,
      views: 542,
      fileSize: '124 MB',
      tags: ['Training', 'Fertilizer', 'Organic'],
      coverKind: 'video',
      coverImageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&h=400&q=80',
      stagePill: 'All Stages'
    },
    {
      id: 'KM-004',
      title: 'Pest Management Alert: Brown Planthopper',
      description: 'Emergency alert and prevention measures for brown planthopper outbreak affecting northern provinces',
      contentType: 'Pest/Disease Alert',
      documentType: 'PDF Document',
      targetCrop: 'Rice',
      uploadDate: '2024-03-22',
      uploadedBy: 'Plant Protection Office',
      uploaderRole: 'Agricultural Officer',
      status: 'Published',
      downloads: 678,
      views: 2103,
      fileSize: '420 KB',
      tags: ['Pest Management', 'Rice', 'Alert'],
      coverKind: 'pdf',
      coverImageUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&h=400&q=80',
      stagePill: 'Developing'
    },
    {
      id: 'KM-005',
      title: 'FOMMP User Manual - AC Module',
      description: 'Complete user manual for Agricultural Cooperatives covering all platform features and functions',
      contentType: 'User Manual',
      documentType: 'PDF Document',
      targetCrop: 'All Crop Types',
      uploadDate: '2024-01-15',
      uploadedBy: 'System Administrator',
      uploaderRole: 'FAO/PEARL Officer',
      status: 'Published',
      downloads: 523,
      views: 892,
      fileSize: '3.1 MB',
      tags: ['Training', 'Best Practices'],
      coverKind: 'pdf',
      coverImageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&h=400&q=80',
      stagePill: 'All Stages'
    },
    {
      id: 'KM-006',
      title: 'Government Subsidy Program 2024',
      description: 'Official announcement and application guidelines for the 2024 agricultural subsidy program',
      contentType: 'Government Program Announcement',
      documentType: 'Video',
      targetCrop: 'All Crop Types',
      uploadDate: '2024-03-10',
      uploadedBy: 'Ministry Committee',
      uploaderRole: 'Ministry Committee',
      status: 'Published',
      downloads: 892,
      views: 1567,
      fileSize: '560 KB',
      tags: ['Training', 'Certification'],
      coverKind: 'video',
      coverImageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&h=400&q=80',
      stagePill: 'Developing'
    }
  ];

  readonly filteredMaterials = computed(() => {
    const q = this.searchTerm().trim().toLowerCase();
    if (!q) return this.materials;
    return this.materials.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q)) ||
        m.contentType.toLowerCase().includes(q)
    );
  });

  mediaLabel(material: KnowledgeMaterial): string {
    if (material.documentType.includes('PDF')) return 'PDF Document';
    if (material.documentType.includes('Video')) return 'Video';
    return 'Image';
  }

  toggleTag(tag: string): void {
    this.selectedTags.update((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]));
  }
}
