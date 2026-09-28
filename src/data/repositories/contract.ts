import type {
  Location,
  LocationDetail,
  Post,
  PostDetail,
  Project,
  ProjectDetail,
  Service,
  ServiceDetail,
  Testimonial,
} from "@/data/types";

export type ListOptions = {
  limit?: number;
  featured?: boolean;
  locationId?: string;
  categorySlug?: string;
  preview?: boolean;
};

export type BySlugOptions = {
  preview?: boolean;
};

export interface ContentRepository {
  getProjects(options?: ListOptions): Promise<Project[]>;
  getProjectBySlug(slug: string, options?: BySlugOptions): Promise<ProjectDetail | null>;
  getServices(options?: ListOptions): Promise<Service[]>;
  getServiceBySlug(slug: string, options?: BySlugOptions): Promise<ServiceDetail | null>;
  getLocations(options?: ListOptions): Promise<Location[]>;
  getLocationBySlug(slug: string, options?: BySlugOptions): Promise<LocationDetail | null>;
  getPosts(options?: ListOptions): Promise<Post[]>;
  getPostBySlug(slug: string, options?: BySlugOptions): Promise<PostDetail | null>;
  getTestimonials(options?: ListOptions): Promise<Testimonial[]>;
}
