const supabase = require('../config/Database');

/**
 * fxd4 Engine - BaseModel (Eloquent Style)
 * Lokasi: core/model/BaseModel.js
 */
class BaseModel {
    constructor(tableName) {
        this.table = tableName;
        this.queryInstance = null;
    }

    /**
     * Inisialisasi query builder
     * Digunakan secara internal untuk memulai chaining
     */
    _initQuery() {
        if (!this.queryInstance) {
            this.queryInstance = supabase.from(this.table).select('*');
        }
        return this.queryInstance;
    }

    // --- FETCH METHODS ---

    async get() {
        const query = this._initQuery();
        const { data, error } = await query;
        this.queryInstance = null; // Reset builder setelah eksekusi
        if (error) throw error;
        return data;
    }

    async first() {
        const query = this._initQuery();
        const { data, error } = await query.single();
        this.queryInstance = null;
        if (error && error.code !== 'PGRST116') throw error;
        return data || null;
    }

    async all() {
        return await this.get();
    }

    async find(id) {
        return await this.where('id', id).first();
    }

    // --- FILTER METHODS (CHAINABLE) ---

    where(column, value) {
        this._initQuery().eq(column, value);
        return this;
    }

    whereIn(column, values) {
        this._initQuery().in(column, values);
        return this;
    }

    /**
     * Supabase menggunakan sintaksis filter or() yang berbeda dengan where()
     * Contoh: .or('id.eq.1,id.eq.2')
     */
    whereOr(filterString) {
        this._initQuery().or(filterString);
        return this;
    }

    orderBy(column, { ascending = true } = {}) {
        this._initQuery().order(column, { ascending });
        return this;
    }

    limit(count) {
        this._initQuery().limit(count);
        return this;
    }

    // --- ACTION METHODS ---

    async create(payload) {
        const { data, error } = await supabase
            .from(this.table)
            .insert([payload])
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    async update(id, payload) {
        const { data, error } = await supabase
            .from(this.table)
            .update(payload)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    async delete(id) {
        const { error } = await supabase
            .from(this.table)
            .delete()
            .eq('id', id);
        if (error) throw error;
        return true;
    }

    /**
     * FindBy dinamis untuk kolom apa saja
     */
    async findBy(column, value) {
        return await this.where(column, value).first();
    }

    /**
     * Akses langsung ke raw query builder Supabase
     */
    query() {
        return supabase.from(this.table);
    }
}

module.exports = BaseModel;