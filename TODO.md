# Event Schedules Migration TODO

## Overview

Migrate Event model from startDate/endDate to schedules array structure.

## Tasks

### Type Definitions

- [x] Update types/event.d.ts to include ScheduleItem type and update Event interface

### Services & API

- [x] Update services/event/event.service.ts - remove startDate/endDate references
- [x] Update use-cases/api/event.ts - update filtering logic for schedules

### Hooks

- [x] Update hooks/event/useEventForm.ts - change form handling for schedules
- [x] Update hooks/event/useEventFormRefactored.ts - update form data structure
- [x] Update hooks/event/useEventPage.ts - update filtering and sorting
- [x] Update hooks/event/useEventManagement.ts - update management logic

### Admin Components

- [ ] Update components/admin/pages/event/Form.tsx - change form inputs for schedules
- [ ] Update components/admin/pages/event/Table.tsx - update table display logic

### Public Components

- [ ] Update components/public/sections/event/detail/EventDetailHeroSection.tsx - display schedules
- [ ] Update components/public/pages/card/event/EventCard.tsx - show schedule info
- [ ] Update components/public/pages/event/EventCalendarView.tsx - calendar display
- [ ] Update components/public/pages/event/FeaturedPastEvents.tsx - past events logic

### Utility Functions

- [ ] Update lib/event-utils.ts - helper functions for schedules
- [ ] Update lib/eventDetailUtils.ts - detail utilities
- [ ] Update lib/gallery-utils.ts - gallery related event utils

### Other Files

- [ ] Update components/admin/pages/activity/Filters.tsx - activity filtering
- [ ] Update components/public/sections/gallery/GalleryDetailRelatedAlbumsSection.tsx - gallery display
- [ ] Update hooks/gallery/useGalleryDetail.ts - gallery detail logic

### Testing & Validation

- [x] Run prisma generate
- [ ] Test event creation, editing, and display
- [ ] Verify filtering and sorting works with schedules
